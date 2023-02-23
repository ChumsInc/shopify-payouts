import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsReducer from "../ducks/alerts";
import payoutsReducer from "../ducks/payouts";
import paypalReducer from "../ducks/paypal";
import transactionsReducer from "../ducks/transactions";


const rootReducer = combineReducers({
    alerts: alertsReducer,
    payouts: payoutsReducer,
    paypal: paypalReducer,
    transactions: transactionsReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
