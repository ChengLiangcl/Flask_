import { Modal, ModalHeader, ModalBody, Button, Row, Col, Label, Input } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';

function ModelBinding(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    const handleSubmit = (values) => {
        const newValue = values.bindedModel.split(':');
        console.log(newValue);
        props.bindModel(newValue[0], sessionStorage.getItem('verifiedUsername'), props.datasetName);
    };

    return (
        <div>
            <IconButton aria-label="delete a dataset" component="span">
                <SettingsEthernetIcon onClick={toggleModal}/>
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Bind Model</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => handleSubmit(values)}>
                        <Col className="form-group">
                            <Row>
                                <Label md={10} style={{color: "grey"}}>Current binded model: {props.bindedModelName == "" ? "no binded model" : props.bindedModelName}</Label>
                            </Row>
                            <Row style={{paddingTop: '2%'}}>
                                <Label md={4}>Select a model:</Label>
                                <Col md={7}>
                                    <Control.select model=".bindedModel" id="bindedModel" name="bindedModel"
                                        className="form-control">
                                        <option>-----Please select a model-----</option>
                                        {props.modelFiles.map( eachModel => <option>{`${eachModel.FileName}: ${eachModel.BriefInfo}`}</option>)}
                                    </Control.select>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Button type="submit" onClick={handlenNoBtn}>Bind</Button>
                        </Col>
                    </LocalForm>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default ModelBinding;