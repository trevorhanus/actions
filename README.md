# Actions

An action management framework that provides a central dispatcher, undo/redo functionality, throttling and debouncing.

## Usage

Simple Action. Non-reversible, no throttling, no debouncing

```typescript
import {Store} from './where/your/store/is/Store';
import {Action, Actions} from 'actions';

// Declare some action
interface IDoSomethingParams {
    foo: string;
}

class DoSomething extends Action<Store, IDoSomethingParams> {
    
    constructor(params: IDoSomethingParams) {
        super(params);
    }
    
    invoke(store: Store) {
        // can do anything here
    }
}

// dispatch the action
Actions.dispatch(new DoSomething({foo: 'bar'}));

// Since this action is non-reversible, we can't undo it
console.log(`can undo: ${Actions.dispatcher.canUndo}`); // this will be false
```

Reversible Action with throttling

```typescript
import {Store} from './where/your/store/is/Store';
import {ReversibleAction, Actions} from 'actions';

// Declare some action
interface IDoReversibleParams {
    foo: string;
}

class ReversibleSomething extends ReversibleAction<Store, IDoReversibleParams> {
    
    constructor(params: IDoReversibleParams) {
        super(params);
    }
    
    invoke(store: Store) {
        // can do anything here
    }
    
    undo(store: Store) {
        // do whatever we need to do to reverse the invocation
    }
    
    redo(store: Store) {
        // do whatever we need to do to redo the initial invocation
    }
}

// dispatch the action
// by passing the throttle option we ensure that this same action cannot
// be dispatched in the next 1500 milliseconds
Actions.dispatch(new ReversibleSomething({foo: 'bar'}), {throttle: 1500});

// Since this action is non-reversible, we can't undo it
console.log(`can undo: ${Actions.dispatcher.canUndo}`); // this will be true

// undo the action
Actions.dispatcher.undo();

// redo the action
Actions.dispatcher.redo();
```

## Run Tests

```bash
$ yarn install
$ yarn test
```
