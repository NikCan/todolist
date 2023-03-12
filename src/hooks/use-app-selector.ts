import {TypedUseSelectorHook, useSelector} from 'react-redux';
import type {AppRootStateType} from 'app/store';

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
