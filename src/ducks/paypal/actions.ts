import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ExtendedSavedOrder} from "chums-types";
import {fetchPaypalInvoices} from "@/api/payouts.ts";
import type {RootState} from "@/app/configureStore.ts";
import {selectPaypalStatus} from "@/ducks/paypal/paypalSlice.ts";

export const loadPaypalInvoices = createAsyncThunk<ExtendedSavedOrder[], void, {state:RootState}>(
    'paypal/loadInvoices',
    async () => {
        return await fetchPaypalInvoices();
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return selectPaypalStatus(state) === 'idle';
        }
    }
)
