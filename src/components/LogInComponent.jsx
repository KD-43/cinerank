import Modal from '../../node_modules/react-bootstrap/Modal';
import Button from '../../node_modules/react-bootstrap/Button';

export default function LogIn ({ show, onHide, title, onSwitchFormType, children, onLogIn }) {
    
    return (
        
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-align-center">
                    <p><span className="fs-5 fw-bold">Preface:</span> You do <u>NOT</u> need to generate an ID to interact with this demo. Doing so allows you to save Tier lists and come back to it on your original device.</p>
                    {children}
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-between'>
                <Button variant="success" type="submit" onClick={onLogIn}>
                    Log In
                </Button>
                <Button variant="primary" onClick={onSwitchFormType}>
                    Need a User ID? Generate One.
                </Button>
            </Modal.Footer>
        </Modal>
    )
}