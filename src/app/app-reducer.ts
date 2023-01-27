const initialState: InitialStateType = {
    status: 'idle',
    errorMessage: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, errorMessage: action.errorMessage}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

// actions
export const SetAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const SetAppErrorMessageAC = (errorMessage: string | null) => ({type: 'APP/SET-ERROR', errorMessage} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

// thunks

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    errorMessage: null | string
    isInitialized: boolean
}

export type SetAppStatusActionType = ReturnType<typeof SetAppStatusAC>
export type SetErrorMessageActionType = ReturnType<typeof SetAppErrorMessageAC>

export type AppActionsType =
    | SetAppStatusActionType
    | SetErrorMessageActionType
    | ReturnType<typeof setIsInitializedAC>
