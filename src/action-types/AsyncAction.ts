import {IAction, Action} from './Action';

export interface IAsyncAction<Store, Params> extends IAction<Store, Params> {
    invoke(store: Store): Promise<any>;
}

export abstract class AsyncAction<Store, Params> extends Action<Store, Params> implements IAsyncAction<Store, Params> {

    invoke(store: Store): Promise<any> {
        throw new Error(`Invoke was not implemented in action ${this.name}`);
    }
}
