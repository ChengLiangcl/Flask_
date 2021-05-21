import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import DatasetUpload from '../DatasetUploadComponent';

function DatasetUploading(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    const closeModal = () => {
        setModal(!isModalOpen);
        props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
    }

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    return (
        <div>
            <IconButton aria-label="connect uploading" component="span">
                <PublishIcon onClick={toggleModal} />
            </IconButton>

            <p style={{color: "grey"}}>Please upload your datasets here</p>

            <Modal isOpen={isModalOpen} centered={true}>
                <ModalHeader toggle={closeModal}>Upload your datasets</ModalHeader>
                <ModalBody>
                    <DatasetUpload uploadDataset={props.uploadDataset} fetchDatasetFiles={props.fetchDatasetFiles}/>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default DatasetUploading;