import { IAction } from "./action-types/Action";
import { Dispatcher } from "./Dispatcher";
import { invariant } from "./utils";

export class Actions {

    static dispatcher: Dispatcher<any> = null;

    static dispatch(action: IAction<any, any>): any {
        invariant(Actions.dispatcher === null, `the dispatcher has not been created. You must call Actions.createDispatcher() before you can dispatch any actions.`);
        return Actions.dispatcher.dispatch(action);
    }

    static createDispatcher<Store>(store: Store): Dispatcher<Store> {
        invariant(Actions.dispatcher !== null, `a dispatcher was already created. cannot create another instance.`);
        Actions.dispatcher = Dispatcher.create<Store>(store);
        return Actions.dispatcher;
    }
}

export function dispatch(action: IAction<any, any>): any {
    return Actions.dispatch(action);
}
