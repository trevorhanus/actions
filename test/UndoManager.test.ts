import {expect} from 'chai';
import {UndoManager} from '../src/UndoManager';
import {MockReversibleAction} from './Mocks';

describe('UndoManager', () => {

    describe('constructor', () => {
        it('works', () => {
            const um = new UndoManager();
            expect(um).to.be.ok;
        });
    });

    describe('UndoManager#registerAction', () => {

        it('registers an action', () => {
            const um = new UndoManager();
            const a1 = new MockReversibleAction('test');
            um.registerAction(a1);
            expect(um.canUndo).to.be.true;
        });

        it('calls actions undo method', () => {
            const um = new UndoManager();
            const a1 = new MockReversibleAction('test');
            um.registerAction(a1);
            um.undo({} as any);
            expect(a1.undo.callCount).to.equal(1);
        });

        it('cannot undo past last registered action', () => {
            const um = new UndoManager();
            const a1 = new MockReversibleAction('test');
            const a2 = new MockReversibleAction('test2');
            um.registerAction(a1);
            um.registerAction(a2);
            expect(um.canUndo).to.be.true;
            um.undo({} as any);
            expect(um.canUndo).to.be.true;
            um.undo({} as any);
            expect(um.canUndo).to.be.false;
        });

        it('cannot redo after undo', () => {
            const um = new UndoManager();
            const a1 = new MockReversibleAction('test');
            um.registerAction(a1);
            um.undo({} as any);
            expect(um.canRedo).to.be.true;
            const a2 = new MockReversibleAction('test3');
            um.registerAction(a2);
            expect(um.canRedo).to.be.false;
            expect(um.canUndo).to.be.true;
        });
    });
});
