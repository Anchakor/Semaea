import * as Test from '../Test';
import * as Dialogs from './Dialogs';
import * as Graphs from './Graphs';

export function runUIStoreTests() {
  Test.test('Reducer state equality', function(assert) {
    // Arrange
    const state = Graphs.defaultState;
    const actionToProcess = Graphs.createDeleteGraphAction(0);
    const actionToReject = Dialogs.createCancelDialogAction(0);

    // Act
    var newState = Graphs.reducer(state, actionToProcess);
    var newState2 = Graphs.reducer(state, actionToReject);

    // Assert
    assert.ok(newState != state, "newState should be different from the original state, allowing it as a condition to return the newState from reducers and not process any further.")
    // if (newState != state) { return newState; }
    assert.ok(newState2 == state, "newState should be equal to the original state, as this reducer doesn't process this action.")
  });
}