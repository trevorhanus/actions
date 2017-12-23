import * as sinon from 'sinon';
import {expect} from 'chai';
import * as utils from '../src/utils';
import {SinonFakeTimers, SinonStub} from 'sinon';
import {ThrottleManager} from "../src/ThrottleManager";
import {DebounceManager} from "../src/DebounceManager";
import {IUndoManager, UndoManager} from "../src/UndoManager";
import {IReversibleAction} from "../src/action-types/ReversibleAction";
import {MockReversibleAction} from "./Mocks";

describe('ThrottleManager', () => {
    let clock: SinonFakeTimers;
    let warnStub: SinonStub;
    let undoManager: IUndoManager<any>;
    let registerActionStub: SinonStub;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        warnStub = sinon.stub(utils, 'warn');
        undoManager = new UndoManager();
        registerActionStub = sinon.stub(undoManager, 'registerAction');
    });

    afterEach(() => {
        clock.restore();
        warnStub.restore();
    });

    describe('constructor', () => {

        it('works', () => {
            const dm = new DebounceManager(null);
            expect(dm).to.be.ok;
        });
    });

    describe('debouncing', () => {

        it('can debounce', () => {
            const dm = new DebounceManager(undoManager);
            const action = {name: 'test'};
            dm.debounce(action as IReversibleAction<any, any>, 300);
            expect(dm.isDebounced(action as IReversibleAction<any, any>)).to.be.true;
        });

        it('finises debounce after duration', () => {
            const dm = new DebounceManager(undoManager);
            const action = {name: 'test'};
            dm.debounce(action as IReversibleAction<any, any>, 300);
            clock.tick(301);
            expect(dm.isDebounced(action as IReversibleAction<any, any>)).to.be.false;
            expect(registerActionStub.callCount).to.equal(1);
            expect(registerActionStub.getCall(0).args[0]).to.deep.equal(action);
        });

        it('appends parameters to a debuonced action', () => {
            const dm = new DebounceManager(undoManager);
            const action1 = new MockReversibleAction('test');
            const action2 = new MockReversibleAction('test');
            dm.debounce(action1 as IReversibleAction<any, any>, 1000);
            clock.tick(200);
            dm.debounce(action2 as IReversibleAction<any, any>, 1000);
            expect(dm.isDebounced(action1 as IReversibleAction<any, any>)).to.be.true;
            expect(action1.appendDebounceParams.callCount).to.equal(1);
            clock.tick(1001);
            expect(dm.isDebounced(action1 as IReversibleAction<any, any>)).to.be.false;
        });
    });
});
