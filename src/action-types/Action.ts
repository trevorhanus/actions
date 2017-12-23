import {v4 as uuidv4} from 'uuid';

export interface IAction<Store, Params> {
    id: string;
    name: string;
    isReversible: boolean;
    params: Params;
    invoke: (store: Store) => any;
}

export abstract class Action<Store, Params> implements IAction<Store, Params> {
    id: string;
    isReversible: boolean;
    params: Params;
    name: string;

    constructor(params?: Params) {
        this.id = uuidv4();
        this.isReversible = false;
        this.params = params;
        this.name = 'snow';
    }

    invoke(store: Store): any {
        throw new Error(`Invoke was not implemented in action ${this.name}`);
    };
}
