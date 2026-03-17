import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ShopifyPaymentsPayout} from "@/ducks/types.ts";
import type {RootState} from "@/app/configureStore.ts";
import {fetchPayouts, postPayoutComplete} from "@/api/payouts.ts";
import {selectPayoutsStatus} from "@/ducks/payouts/index.ts";

export const loadPayouts = createAsyncThunk<ShopifyPaymentsPayout[], void, { state: RootState }>(
    'payouts/load',
    async () => {
        return await fetchPayouts();
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return selectPayoutsStatus(state) === 'idle';
        }
    }
)

export const markPayoutComplete = createAsyncThunk<ShopifyPaymentsPayout[], number | string, { state: RootState }>(
    'payouts/complete',
    async (arg) => {
        return await postPayoutComplete(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            if (!arg) {
                return false;
            }
            return selectPayoutsStatus(state) === 'idle';
        }
    }
)
