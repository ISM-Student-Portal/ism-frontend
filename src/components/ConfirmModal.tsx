import { Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

function ConfirmModal({ header, text }: any) {
    return (
        <Alert variant="warning">
            <Alert.Heading>{header}</Alert.Heading>
            <p>
                {text}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button variant="outline-success">
                    Confirm
                </Button>
                <Button variant="outline-danger">
                    Cancel
                </Button>
            </div>

        </Alert>
    );
}

export default ConfirmModal;