import {appActions, appReducer} from "./app-reducer";

type InitialStateType = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  errorMessage: null | string
  isInitialized: boolean
}
let startState: InitialStateType
beforeEach(() => {
  startState = {
    status: "idle",
    errorMessage: null,
    isInitialized: true
  }
})

test('correct status should be set', () => {
  const action = appActions.SetAppStatusAC({status: "loading"})
  const endState = appReducer(startState, action)

  expect(endState.status).toBe("loading")
})

test('correct error message should be set', () => {
  const action = appActions.SetAppErrorMessageAC({errorMessage: 'error'})
  const endState = appReducer(startState, action)

  expect(endState.errorMessage).toBe("error")
})