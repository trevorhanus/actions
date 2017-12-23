import * as sinon from 'sinon';
import {expect} from 'chai';
import {SinonFakeTimers} from 'sinon';
import {ThrottleManager} from "../src/ThrottleManager";
import {IAction} from "../src/action-types/Action";

describe('ThrottleManager', () => {
    let clock: SinonFakeTimers;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    describe('constructor', () => {
        it('no params', () => {
            const tm = new ThrottleManager();
            expect(tm).to.be.ok;
        });
    });

    describe('throttle', () => {
        it('can throttle an action', () => {
            const tm = new ThrottleManager();
            const action = {name: 'test'};
            tm.throttle(action as IAction<any, any>, 500);
            expect(tm.isThrottled(action as IAction<any, any>)).to.be.true;
            clock.tick(200);
            expect(tm.isThrottled(action as IAction<any, any>)).to.be.true;
            clock.tick(301);
            expect(tm.isThrottled(action as IAction<any, any>)).to.be.false;
        });

        it('does not throttle an already throttled action', () => {
            const tm = new ThrottleManager();
            const action = {name: 'test'};
            tm.throttle(action as IAction<any, any>, 500);
            expect(tm.isThrottled(action as IAction<any, any>)).to.be.true;
            clock.tick(400);
            tm.throttle(action as IAction<any, any>, 500);
            clock.tick(150);
            expect(tm.isThrottled(action as IAction<any, any>)).to.be.false;
        });

        it('throttle multiple actions', () => {
            const tm = new ThrottleManager();
            const action1 = {name: 'test'};
            const action2 = {name: 'test2'};
            tm.throttle(action1 as IAction<any, any>, 500);
            tm.throttle(action2 as IAction<any, any>, 1000);
            expect(tm.isThrottled(action1 as IAction<any, any>)).to.be.true;
            expect(tm.isThrottled(action2 as IAction<any, any>)).to.be.true;
            clock.tick(501);
            expect(tm.isThrottled(action1 as IAction<any, any>)).to.be.false;
            expect(tm.isThrottled(action2 as IAction<any, any>)).to.be.true;
            clock.tick(500);
            expect(tm.isThrottled(action2 as IAction<any, any>)).to.be.false;
        });
    });
});
