import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {dismissAlert, selectAllAlerts, type StyledErrorAlert} from "@chumsinc/alert-list";
import {Alert} from "react-bootstrap";

export default function AppAlertList() {
    const dispatch = useAppDispatch();
    const alerts = useAppSelector(selectAllAlerts);
    const dismissHandler = (alert: StyledErrorAlert) => {
        dispatch(dismissAlert(alert))
    }
    return (
        <div>
            {alerts.map(alert => (
                <Alert key={alert.id} variant={alert.variant} dismissible onClose={() => dismissHandler(alert)}>
                    {alert.message}
                </Alert>)
            )}
        </div>
    )
}
