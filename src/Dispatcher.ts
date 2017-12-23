import { action, computed } from 'mobx';
import { isNullOrUndefined } from 'util';
import { IAction } from './action-types/Action';
import { IAsyncAction } from './action-types/AsyncAction';
import { DebounceManager, IDebounceManager } from './DebounceManager';
import { IReversibleAction } from './action-types/ReversibleAction';
import { IThrottleManager, ThrottleManager } from './ThrottleManager';
import { IUndoManager, UndoManager } from './UndoManager';

export interface IDispatcher<Store> {
    dispatch: (action: IAction<Store, any>, options?: IDispatchOptions) => any;
    dispatchAsync: (action: IAction<Store, any>, options?: IDispatchOptions) => Promise<any>;
    undo: () => any;
    redo: () => any;
    canUndo: boolean;
    canRedo: boolean;
}

export interface IDispatchOptions {
    debounce?: number;
    throttle?: number;
}

export class Dispatcher<Store> implements IDispatcher<Store> {
    private _store: Store;
    private _undoManager: IUndoManager<Store>;
    private _throttleManager: IThrottleManager;
    private _debounceManager: IDebounceManager;

    constructor(store: Store, undoManager: IUndoManager<Store>, throttleManager: IThrottleManager, debounceManager: IDebounceManager) {
        this._store = store;
        this._undoManager = undoManager;
        this._throttleManager = throttleManager;
        this._debounceManager = debounceManager;
    }

    public dispatch(action: IAction<Store, any>, options?: IDispatchOptions): any {
        // return immediately if this action is throttled
        if (this._throttleManager.isThrottled(action)) return;

        const { debounce, throttle } = options || { debounce: null, throttle: null };

        const result = action.invoke(this._store);

        if (!isNullOrUndefined(throttle)) {
            // register this action with the throttle manager
            // that way if it is dispatched again within the throttle period
            // it will not be invoked
            this._throttleManager.throttle(action, throttle);
        }

        // debouncing
        if (!isNullOrUndefined(debounce) && action.isReversible) {
            this._debounceManager.debounce(action as IReversibleAction<Store, any>, debounce);
        }

        // not debouncing
        if (isNullOrUndefined(debounce) && action.isReversible) {
            this._undoManager.registerAction(action as IReversibleAction<Store, any>);
        }

        return result;

    }

    public dispatchAsync(action: IAsyncAction<Store, any>, options?: IDispatchOptions): Promise<any> {
        return this.dispatch(action, options);
    }

    @computed
    public get canUndo(): boolean {
        return this._undoManager.canUndo;
    }

    @computed
    public get canRedo(): boolean {
        return this._undoManager.canRedo;
    }

    @action
    public undo(): any {
        return this._undoManager.undo(this._store);
    }

    @action
    public redo(): any {
        return this._undoManager.redo(this._store);
    }

    static create<Store>(store: Store): Dispatcher<Store> {
        const undoManager = new UndoManager();
        const throttleManager = new ThrottleManager();
        const debounceManager = new DebounceManager(undoManager);
        return new Dispatcher<Store>(store, undoManager, throttleManager, debounceManager);
    }
}
