import {expect} from 'chai';
import {Dispatcher, IDispatcher} from '../src/Dispatcher';
import {IUndoManager, UndoManager} from "../src/UndoManager";
import {IThrottleManager, ThrottleManager} from "../src/ThrottleManager";
import {IDebounceManager, DebounceManager} from "../src/DebounceManager";
import { AsyncAction } from '../src/action-types/AsyncAction';

describe('AsyncAction', () => {
    let undoManager: IUndoManager<any>;
    let throttleManager: IThrottleManager;
    let debounceManager: IDebounceManager;
    let dispatcher: IDispatcher<any>;

    beforeEach(() => {
        undoManager = new UndoManager();
        throttleManager = new ThrottleManager();
        debounceManager = new DebounceManager(null);
        dispatcher = new Dispatcher({}, undoManager, throttleManager, debounceManager);
    });

    it('dispatch returns a promise', () => {

        class SimpleTimer extends AsyncAction<{}, {}> {

            invoke(): Promise<string> {
                return new Promise(resolve => {

                    setTimeout(() => {
                        resolve('success');
                    }, 5);
                });
            }
        }

        const action = new SimpleTimer();
        const prom = dispatcher.dispatchAsync(action);
        return prom.then(resp => {
                expect(resp).to.equal('success');
            })
            .catch(e => {
                throw e;
            });
    });

    it('can run as async', async () => {
        class SimpleTimer extends AsyncAction<{}, {}> {

            invoke(): Promise<string> {
                return new Promise(resolve => {

                    setTimeout(() => {
                        resolve('success');
                    }, 5);
                });
            }
        }

        const action = new SimpleTimer();
        const resp = await dispatcher.dispatchAsync(action);
        expect(resp).to.equal('success');
    });
});
