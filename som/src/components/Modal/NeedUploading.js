import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

function NeedUploading(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    return (
        <div>
            <IconButton aria-label="delete a dataset" component="span">
                <DeleteIcon onClick={toggleModal} />
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Dataset Delete</ModalHeader>
                <ModalBody>
                    <p>You have not selected any model. Please select one before uploading !</p>
                    <Row>
                        <Col>
                            <Button onClick={handlenNoBtn}>Got it!</Button>
                        </Col>          
                    </Row>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default NeedUploading;