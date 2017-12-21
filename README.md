# Actions

An action management framework that provides a central dispatcher, undo/redo functionality, throttling and debouncing.

## Usage

### Initialize the Dispatcher

First we need to initialize the dispatcher. During initialization, we pass in our store instance. Doing this means that every action we dispatch can be passed the store as a parameter to it's invoke method. Which gives our actions a lot of flexibility in what they can do.

```typescript
import { Store } from './where/your/store/is/Store';
import { Actions } from '@trevorhanus/actions'

const store = new Store();
Actions.createDispatcher(store);
```

### Define and dispatch an Action

This is a simple Action. Non-reversible, no throttling, no debouncing

```typescript
import { Store } from './where/your/store/is/Store';
import { Action, Actions } from 'actions';

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
console.log(`can undo: ${Actions.dispatcher.canUndo}`); // false
```

### Returning Data from invoke()

Sometimes you want to return data from an action. You can do this simply by returning a value from the invoke method.

```typescript
  
// Declare the actions param type
interface IPromptUserForInputParams {
    message: string;
}
  
class PromptUserAction extends Action<Store, IPromptUserForInputParams> {
    
    constructor(params: IPromptUserForInputParams) {
        super(params);
    }
    
    invoke(store: Store): string {
        const { message } = this.params;
        const input = prompt(message);
        return input;
    }
}
  
// dispatch the action
const userInput = Actions.dispatch(new PromptUserAction({ message: 'Enter your age.' }));
console.log(`Users age is ${userInput}`);
```

### Reversible Action with throttling

```typescript
import { Store } from './where/your/store/is/Store';
import { ReversibleAction, Actions } from 'actions';

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

### Async Action

There will be times when you need to run an async action and do something when it finishes. For instance, save some data on the backend and then show either a success message or failure message when it gets back. You can use an AsyncAction to do this.

```typescript
import { Store } from './where/your/store/is/Store';
import { AsyncAction } from 'actions';

interface ISaveDataParams {
    myData: string;
}

class SaveDataInBackendAction extends AsyncAction<Store, ISaveDataParams> {
    
    constructor(params: ISaveDataParams) {
        super(params);
    }
    
    invoke(store: Store): Promise<'success' | 'failed'> {
        const data = this.params.myData;
        
        return funcThatMakesCalloutToBackend(data)
            .then((err, res) => {
                if (err) return 'failed';
                return 'success';
            });
    }
}

const resp = await Actions.dispatchAsync(new SaveDataInBackendAction({ myData: 'bar' }));
```


## Run Tests

```bash
$ yarn install
$ yarn test
```
