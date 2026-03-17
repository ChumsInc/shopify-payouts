import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import payoutsSlice from "@/ducks/payouts";
import paypalSlice from "@/ducks/paypal/paypalSlice.ts";
import transactionsSlice from "@/ducks/transactions/transactionsSlice.ts";
import {alertsSlice} from "@chumsinc/alert-list";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [payoutsSlice.reducerPath]: payoutsSlice.reducer,
    [transactionsSlice.reducerPath]: transactionsSlice.reducer,
    [paypalSlice.reducerPath]: paypalSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error']
        }
    })
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
