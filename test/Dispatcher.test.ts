import {expect} from 'chai';
import * as sinon from 'sinon';
import {Dispatcher, IDispatcher} from '../src/Dispatcher';
import {SinonFakeTimers} from "sinon";
import {IUndoManager, UndoManager} from "../src/UndoManager";
import {IThrottleManager, ThrottleManager} from "../src/ThrottleManager";
import {IDebounceManager, DebounceManager} from "../src/DebounceManager";
import {MockAction, MockReversibleAction} from './Mocks';

describe('Dispatcher', () => {
    let clock: SinonFakeTimers;
    let undoManager: IUndoManager<any>;
    let throttleManager: IThrottleManager;
    let debounceManager: IDebounceManager;
    let dispatcher: IDispatcher<any>;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        undoManager = new UndoManager();
        throttleManager = new ThrottleManager();
        debounceManager = new DebounceManager(null);
        dispatcher = new Dispatcher({}, undoManager, throttleManager, debounceManager);
    });

    afterEach(() => {
        clock.restore();
    });

    describe('constructor', () => {

        it('works', () => {
            const d = new Dispatcher(null, null, null, null);
            expect(d).to.be.ok;
        });
    });

    describe('Dispatcher#dispatch', () => {

        it('standard action', () => {
            const action = new MockAction('test');
            dispatcher.dispatch(action);
            expect(action.invoke.callCount).to.equal(1);
        });

        it('standard action with debounce', () => {
            const debounceStub = sinon.stub(debounceManager, 'debounce');
            const action = new MockAction('test');
            dispatcher.dispatch(action, {debounce: 100});
            expect(action.invoke.callCount).to.equal(1);
            expect(debounceStub.callCount).to.equal(0);
            debounceStub.restore();
        });

        it('standard action with throttle', () => {
            const throttleStub = sinon.stub(throttleManager, 'throttle');
            const action = new MockAction('test');
            dispatcher.dispatch(action, {throttle: 100});
            expect(action.invoke.callCount).to.equal(1);
            expect(throttleStub.callCount).to.equal(1);
            expect(throttleStub.getCall(0).args).to.deep.equal([action, 100]);
            throttleStub.restore();
        });

        it('reversable action', () => {
            const registerActionStub = sinon.stub(undoManager, 'registerAction');
            const action = new MockReversibleAction('test');
            dispatcher.dispatch(action);
            expect(action.invoke.callCount).to.equal(1);
            expect(registerActionStub.callCount).to.equal(1);
            expect(registerActionStub.getCall(0).args).to.deep.equal([action]);
            registerActionStub.restore();
        });

        it('reversable action with debounce', () => {
            const debounceStub = sinon.stub(debounceManager, 'debounce');
            const registerActionStub = sinon.stub(undoManager, 'registerAction');
            const action = new MockReversibleAction('test');
            dispatcher.dispatch(action, {debounce: 100});

            expect(action.invoke.callCount).to.equal(1);
            expect(debounceStub.callCount).to.equal(1);
            expect(registerActionStub.callCount).to.equal(0);

            debounceStub.restore();
            registerActionStub.restore();
        });
    });
});
