import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "./index";
import {Alert} from "chums-components";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectAlerts);

    return (
        <div>
            {list.map(alert => (
                <Alert key={alert.id} context={alert.context} count={alert.count} color={alert.color ?? 'warning'}
                       canDismiss onDismiss={() => dispatch(dismissAlert(alert.id))}>
                    {alert.message}
                </Alert>
            ))}
        </div>
    )
}
export default AlertList;
