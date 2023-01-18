const initialState: InitialStateType = {
    status: 'idle',
    errorMessage: "error"
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, errorMessage: action.errorMessage}
        default:
            return state
    }
}

// actions
export const SetAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const SetErrorMessageAC = (errorMessage: string | null) => ({type: 'APP/SET-ERROR', errorMessage} as const)

// thunks

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    errorMessage: null | string
}

export type SetAppStatusActionType = ReturnType<typeof SetAppStatusAC>
export type SetErrorMessageActionType = ReturnType<typeof SetErrorMessageAC>

export type AppActionsType =
    | SetAppStatusActionType
    | SetErrorMessageActionType
