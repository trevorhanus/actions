/**
 * NOTE: You must run tsc to build the ../dist folder
 */

import {
    Actions,
    Action,
    ReversibleAction,
    AsyncAction,
} from '../dist/index';

Actions.createDispatcher({});

class FooAction extends Action<{}, {}> {

    invoke() {

    }
}

class Reverse extends ReversibleAction<{}, {}> {

}

class Callout extends AsyncAction<{}, {}> {

}
