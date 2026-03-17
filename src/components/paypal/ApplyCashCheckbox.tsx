import React, {useId} from 'react';
import {selectCashApplied, toggleCashApplied} from "@/ducks/paypal/paypalSlice.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {FormCheck} from "react-bootstrap";


export interface ApplyCashCheckboxProps {
    id?: string | number | null,
}

const ApplyCashCheckbox: React.FC<ApplyCashCheckboxProps> = ({id}) => {
    const dispatch = useAppDispatch();
    const cashApplied = useAppSelector(selectCashApplied);
    const checked = cashApplied[String(id)] ?? false;
    const checkId = useId();

    const changeHandler = () => {
        if (!id) {
            return;
        }
        return dispatch(toggleCashApplied(id.toString()));
    }

    if (!id) {
        return (<span>Apply Cash</span>);
    }

    return (
        <FormCheck type="checkbox" id={checkId}
                   label={checked ? 'Selected' : 'Select'}
                   checked={checked} onChange={changeHandler}/>
    )
}

export default ApplyCashCheckbox;
