import {Button, FormCheck} from "react-bootstrap";
import {loadTransactions, selectTransactionsStatus} from "@/ducks/transactions/transactionsSlice.ts";
import {type ChangeEvent, useId, useState} from "react";
import {markPayoutComplete} from "@/ducks/payouts/actions.ts";
import {selectCurrentPayout} from "@/ducks/payouts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";

export default function TransactionListBar() {
    const dispatch = useAppDispatch();
    const selectedPayout = useAppSelector(selectCurrentPayout);
    const loading = useAppSelector(selectTransactionsStatus);
    const [completed, setCompleted] = useState(false);
    const idMarkCompleted = useId();

    const onReloadTransactions = () => {
        if (!selectedPayout) {
            return;
        }
        dispatch(loadTransactions(selectedPayout.legacyResourceId));
    }
    const onClickCompleted = (ev: ChangeEvent<HTMLInputElement>) => {
        setCompleted(ev.target.checked);
    }

    const onComplete = () => {
        if (!completed || !selectedPayout) {
            return;
        }
        dispatch(markPayoutComplete(selectedPayout?.id));
    }

    return (
        <div className="d-flex justify-content-between mb-1 mt-1">
            <Button variant="secondary" size="sm"
                    onClick={onReloadTransactions} disabled={!selectedPayout}>
                Reload Transactions
            </Button>

            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <FormCheck label="Mark Complete" id={idMarkCompleted}
                               checked={completed} onChange={onClickCompleted}
                               type="checkbox"/>
                </div>
                <div className="col-auto">
                    <Button variant="success" size="sm" onClick={onComplete}
                            disabled={!selectedPayout || loading !== 'idle' || !completed}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
