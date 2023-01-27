import {appReducer, SetAppStatusAC, InitialStateType, SetAppErrorMessageAC} from "./app-reducer";

let startState: InitialStateType
beforeEach(() => {
    startState = {
        status: "idle",
        errorMessage: null,
        isInitialized: true
    }
})

test('correct status should be set', () => {
    const action = SetAppStatusAC("loading")
    const endState = appReducer(startState, action)

    expect(endState.status).toBe("loading")
})

test('correct error message should be set', () => {
    const action = SetAppErrorMessageAC("error")
    const endState = appReducer(startState, action)

    expect(endState.errorMessage).toBe("error")
})