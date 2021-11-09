import React, {ChangeEvent, createRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectOrderCashApplied} from "./selectors";
import {toggleApplyCashAction} from "./actions";


export interface ApplyCashCheckboxProps {
    id: number,
}

const ApplyCashCheckbox: React.FC<ApplyCashCheckboxProps> = ({id}) => {
    const dispatch = useDispatch();
    const checkboxRef = createRef<HTMLInputElement>();
    const checked = useSelector(selectOrderCashApplied(id));

    const changeHandler = (ev: ChangeEvent) => {
        // ev.stopPropagation();
        console.log('dispatching toggleApplyCashAction', id);
        return dispatch(toggleApplyCashAction(id));
    }

    if (!id) {
        return (<span>Apply Cash</span>);
    }

    return (
        <div className="form-check form-check-inline">
            <label htmlFor={`pp--order-id-${id}`} className="form-check-label">
                {checked ? 'Selected' : 'Select'}
            </label>
            <input type="checkbox" className="form-check-input" id={`pp--order-id-${id}`} ref={checkboxRef}
                   checked={checked} onChange={changeHandler}/>
        </div>
    );
}

export default ApplyCashCheckbox;
