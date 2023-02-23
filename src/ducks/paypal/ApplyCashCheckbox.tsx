import React from 'react';
import {useDispatch} from 'react-redux';
import {selectOrderCashApplied} from "./selectors";
import {useAppSelector} from "../../app/configureStore";
import {toggleCashApplied} from "./index";
import {FormCheck} from "chums-components";


export interface ApplyCashCheckboxProps {
    id?: number,
}

const ApplyCashCheckbox: React.FC<ApplyCashCheckboxProps> = ({id}) => {
    const dispatch = useDispatch();
    const checked = useAppSelector((state) => selectOrderCashApplied(state, id ?? 0));

    const changeHandler = () => {
        if (!id) {
            return;
        }
        return dispatch(toggleCashApplied(id));
    }

    if (id === 0) {
        return (<span>Apply Cash</span>);
    }

    return (
        <FormCheck type="checkbox" label={checked ? 'Selected' : 'Select'} checked={checked} onChange={changeHandler}/>
    )
}

export default ApplyCashCheckbox;
