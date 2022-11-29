import {ChangeEvent} from "react";

type CheckBoxType = {
    callBack: (checkedValue: boolean) => void
    isDone: boolean
}
export const CheckBox = (props: CheckBoxType) => {
    const callBackHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.callBack(e.currentTarget.checked)
    }
    return (
        <input type="checkbox" checked={props.isDone}
               color="primary"
               onChange={callBackHandler}/>
    )
}