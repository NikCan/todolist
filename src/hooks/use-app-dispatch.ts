import {useDispatch} from 'react-redux';
import {AppThunkDispatchType} from "app/store";

export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()
