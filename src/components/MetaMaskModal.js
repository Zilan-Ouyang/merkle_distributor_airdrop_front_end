import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import MetaMaskLogo from '../assets/metamask.svg';

function MetaMaskModal() {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    return (
        <>
        <Modal show={show} onHide={handleClose} animation={false} id="metamask-modal">
            <Modal.Header>
            <Modal.Title id="metamask-title">Warning</Modal.Title>
            <Button onClick={() => window.location.reload()} style={{ background: 'transparent', border: 'none' }}>
                <span style={{ color: 'black', fontWeight: 600, outline: 0 }}>x</span>
            </Button>
            </Modal.Header>
            <Modal.Body style={{ alignSelf: 'center' }} id="metamask-body">
            <img src={MetaMaskLogo} alt="" height={70} width={70} />
            Please install{' '}
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://metamask.io/"
                style={{ color: '#F99B42', fontWeight: 'bold' }}
            >
                Meta Mask{' '}
            </a>{' '}
            to start using the app.
            </Modal.Body>
        </Modal>
        </>
    );
}

export default MetaMaskModal;