import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export function ModalComponent ({ show, onHide, onConfirm, title, children, confirmText = "Confirm", confirmVariant = "danger" }) {
    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}