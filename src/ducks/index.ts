import {combineReducers} from "redux";
import {default as payoutsReducer} from './payouts';
import {default as paypalReducer} from './paypal';
import {default as transactionsReducer} from './transactions';
import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from 'chums-ducks';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    payouts: payoutsReducer,
    paypal: paypalReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    transactions: transactionsReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

