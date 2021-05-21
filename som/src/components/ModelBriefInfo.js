import { Modal, ModalHeader, ModalBody, Button, Row, Col, Input } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

function ModelBriefInfo(props) {
    const [isModalOpen, setModal] = useState(false);
    const [briefInfo, setBriefInfo] = useState('');
    const el = useRef(); // accesing input element

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a model
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    //while a user chooses to delete a model
    const handleYesBtn = () => {
        console.log("filename is " + props.modelName);
        props.editModelDescription(props.modelName, briefInfo, sessionStorage.getItem('verifiedUsername'));
        props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'), false);
        //props.fetchModelFiles()
        setModal(!isModalOpen);
    }

    return (
        <div>
            <IconButton aria-label="delete a model" component="span">
                <CreateIcon onClick={toggleModal} />
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Model Description</ModalHeader>
                <ModalBody>
                    <Row style={{paddingLeft: '2%', paddingRight: '2%'}}>
                        <Input placeholder={'Model description'} ref={el} value={briefInfo} onChange={event => setBriefInfo(event.target.value)} />
                    </Row>
                    <Row style={{paddingTop: '5%'}}>
                        <Col>
                            <Button onClick={handleYesBtn} style={{ backgroundColor: '#378CC6' }}>Yes</Button>
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

export default ModelBriefInfo;
