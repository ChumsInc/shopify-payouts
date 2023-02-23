import {createAction, createReducer, isRejected} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {ErrorAlert} from "../types";

export interface AlertsState {
    nextId: number;
    list: ErrorAlert[];
}

export const initialAlertsState: AlertsState = {
    nextId: 0,
    list: [],
}

export const dismissAlert = createAction<number>('alerts/dismiss');
export const addAlert = createAction<ErrorAlert>('alerts/addAlert');

export const selectAlerts = (state:RootState) => state.alerts.list;

const alertsReducer = createReducer(initialAlertsState, (builder) => {
    builder
        .addCase(dismissAlert, (state, action) => {
            state.list = state.list.filter(alert => alert.id !== action.payload);
        })
        .addCase(addAlert, (state, action) => {
            const [contextAlert] = state.list.filter(alert => action.payload.context !== '' && alert.context === action.payload.context)
            if (contextAlert) {
                contextAlert.count += 1;
                state.list = [
                    ...state.list.filter(alert => action.payload.context !== '' && alert.context === action.payload.context),
                    contextAlert
                ];
            } else {
                state.list.push({...action.payload, id: state.nextId});
                state.nextId += 1;
            }
        })
        .addDefaultCase((state, action) => {
            if (isRejected(action) && action.error) {
                state.list.push({
                    context: action.type.replace('/rejected', ''),
                    message: action.error.message ?? '',
                    id: state.nextId,
                    count: 1
                });
                state.nextId += 1;
            }
        })
});

export default alertsReducer;
