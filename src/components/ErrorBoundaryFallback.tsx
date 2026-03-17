import type {FallbackProps} from "react-error-boundary";
import {Alert} from "react-bootstrap";

export type {FallbackProps} from 'react-error-boundary'
export default function ErrorBoundaryFallback({error, resetErrorBoundary}:FallbackProps) {
    const clickHandler = () => {
        resetErrorBoundary();
    }
    if (error instanceof Error) {
        return (
            <Alert variant="danger" onClose={clickHandler} dismissible>
                <Alert.Heading>{error.message}</Alert.Heading>
                <div className="text-monospace">
                    {error.stack}
                </div>
            </Alert>
        )
    }
    return (
        <Alert variant="danger" onClose={clickHandler} dismissible>
            <Alert.Heading>Unknown Error</Alert.Heading>
            <div className="text-monospace">
                {JSON.stringify(error, null, 2)}
            </div>
        </Alert>
    )
}
