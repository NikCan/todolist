import {appReducer, SetAppStatusAC, SetAppErrorMessageAC} from "./app-reducer";
type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    errorMessage: null|string
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
    const action = SetAppStatusAC({status: "loading"})
    const endState = appReducer(startState, action)

    expect(endState.status).toBe("loading")
})

test('correct error message should be set', () => {
    const action = SetAppErrorMessageAC({errorMessage: 'error'})
    const endState = appReducer(startState, action)

    expect(endState.errorMessage).toBe("error")
})