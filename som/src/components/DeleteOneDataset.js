import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

function DeleteOneDataset(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    //while a user chooses to delete a dataset
    const handleYesBtn= () => {
        console.log("filename is " + props.deletedFileName);
        console.log(typeof(props.deleteDataset));
        props.deleteDataset(props.deletedFileName, sessionStorage.getItem('verifiedUsername'));
        setModal(!isModalOpen);
    }

    return (
        <div>
            <IconButton aria-label="delete a dataset" component="span">
                <DeleteIcon onClick={toggleModal}/>
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Dataset Delete</ModalHeader>
                <ModalBody>
                    <p>Do you want to delete this dataset?</p>
                    <Row>
                        <Col>
                            <Button onClick={handleYesBtn} style={{backgroundColor: '#378CC6'}}>Yes</Button>
                        </Col>
                        <Col>
                            <Button onClick={handlenNoBtn}>No</Button>
                        </Col>          
                    </Row>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default DeleteOneDataset;