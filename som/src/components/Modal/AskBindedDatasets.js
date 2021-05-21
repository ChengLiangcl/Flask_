import { Modal, ModalHeader, ModalBody, Button, Row, Col } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BindedDatasets from './BindedDatasets';

function AskBindedDatasets(props) {
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
            <Button style={{ backgroundColor: "transparent", border: 'none', color: "black" }} onClick={toggleModal}>{props.modelName}</Button>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Binded Datasets</ModalHeader>
                <ModalBody>
                    <p>Do you want to check the binded datasets?</p>
                    <Row>
                        <Col>
                            <BindedDatasets modelName={props.modelName} bindedDatasets={props.bindedDatasets}
                                getBindedDatasets={props.getBindedDatasets} userName={props.userName}
                                isBindLoading={props.isBindLoading} />
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

export default AskBindedDatasets;