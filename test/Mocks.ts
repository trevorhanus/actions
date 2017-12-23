import * as sinon from 'sinon';
import {v4 as uuidv4} from 'uuid';
import {SinonStub} from "sinon";
import {IAction} from "../src/action-types/Action";
import {IReversibleAction} from "../src/action-types/ReversibleAction";

export class MockAction implements IAction<any, any> {
    id: string;
    name: string;
    isReversible: boolean;
    params: any;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name || uuidv4();
        this.isReversible = false;
        this.params = {};
    }

    invoke: SinonStub = sinon.stub();
}

export class MockReversibleAction implements IReversibleAction<any, any> {
    id: string;
    isReversible: true;
    name: string;
    params: any;

    constructor(name: string) {
        this.isReversible = true;
        this.name = name || 'test';
        this.params = {};
    }

    invoke: SinonStub = sinon.stub();
    undo: SinonStub = sinon.stub();
    redo: SinonStub = sinon.stub();
    appendDebounceParams: SinonStub = sinon.stub();
}
