import { expect } from 'chai';
import * as sinon from 'sinon';
import { SinonFakeTimers } from 'sinon';
import { Dispatcher, IDispatcher } from "../src/Dispatcher";
import { MockReversibleAction } from "./Mocks";

describe('Dispatcher Integration', () => {
    let clock: SinonFakeTimers;
    let dispatcher: IDispatcher<any>;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        dispatcher = Dispatcher.create({});
    });

    afterEach(() => {
        clock.restore();
    });

    describe('reversable actions', () => {
        it('dispatch>dispatch>undo>redo>undo>undo', () => {
            const firstAction = new MockReversibleAction('test');
            const secondAction = new MockReversibleAction('test');

            dispatcher.dispatch(firstAction);
            dispatcher.dispatch(secondAction);

            expect(secondAction.invoke.callCount).to.equal(1);
            expect(firstAction.invoke.callCount).to.equal(1);

            dispatcher.undo();

            expect(secondAction.undo.callCount).to.equal(1);
            expect(firstAction.undo.callCount).to.equal(0);

            dispatcher.redo();

            expect(secondAction.redo.callCount).to.equal(1);
            expect(firstAction.redo.callCount).to.equal(0);

            dispatcher.undo();

            expect(secondAction.undo.callCount).to.equal(2);
            expect(firstAction.undo.callCount).to.equal(0);

            dispatcher.undo();

            expect(secondAction.undo.callCount).to.equal(2);
            expect(firstAction.undo.callCount).to.equal(1);
        });

        it('dispatch1>dispatch2>undo2>dispatch3>undo3>undo1', () => {
            const action1 = new MockReversibleAction('test');
            const action2 = new MockReversibleAction('test');

            dispatcher.dispatch(action1);
            dispatcher.dispatch(action2);

            expect(action1.invoke.callCount).to.equal(1);
            expect(action2.invoke.callCount).to.equal(1);

            dispatcher.undo(); // undo 2

            expect(action2.undo.callCount).to.equal(1);
            expect(action1.undo.callCount).to.equal(0);

            const action3 = new MockReversibleAction('test');
            dispatcher.dispatch(action3);

            dispatcher.undo(); // undo 3

            expect(action3.undo.callCount).to.equal(1);

            dispatcher.undo(); // undo 1

            expect(action1.undo.callCount).to.equal(1);
        });
    });

    describe('throttle actions', () => {
        it('throttle two action types', () => {
            const action1_0 = new MockReversibleAction('test');
            const action2_0 = new MockReversibleAction('test2');

            dispatcher.dispatch(action1_0, { throttle: 500 });
            dispatcher.dispatch(action2_0, { throttle: 500 });

            clock.tick(100);

            const action1_1 = new MockReversibleAction('test');
            const action2_1 = new MockReversibleAction('test2');

            dispatcher.dispatch(action1_1);
            dispatcher.dispatch(action2_1);

            expect(action1_1.invoke.callCount).to.equal(0);
            expect(action2_1.invoke.callCount).to.equal(0);

            clock.tick(400);

            const action1_2 = new MockReversibleAction('test');
            const action2_2 = new MockReversibleAction('test2');

            dispatcher.dispatch(action1_2);
            dispatcher.dispatch(action2_2);

            expect(action1_2.invoke.callCount).to.equal(1);
            expect(action2_2.invoke.callCount).to.equal(1);
        });
    });

    describe('debounce actions', () => {
        it('debounce 2 times', () => {
            const action0 = new MockReversibleAction('test');
            dispatcher.dispatch(action0, { debounce: 500 });

            expect(action0.invoke.callCount).to.equal(1);
            expect(dispatcher.canUndo).to.be.false;

            clock.tick(100);

            const action1 = new MockReversibleAction('test');
            dispatcher.dispatch(action1, { debounce: 500 });

            expect(action1.invoke.callCount).to.equal(1);
            expect(dispatcher.canUndo).to.be.false;

            clock.tick(501);

            expect(dispatcher.canUndo).to.be.true;

            dispatcher.undo();

            expect(dispatcher.canUndo).to.be.false;
            expect(action0.undo.callCount).to.equal(1);
        });
    });
});
