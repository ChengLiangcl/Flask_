import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { Row, Col, Container, Progress } from 'reactstrap';

function ModelUpload(props) {
    const [dfile, setFile] = useState(''); // storing the uploaded file
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0); // tracking the status of uploading
    const [message, setMessage] = useState("Please upload your model");
    const el = useRef(); // accesing input element

    // It is for get the uploaded file you selected
    const handleChange = (event) => {
        const file = event.target.files[0]; // accessing file
        console.log(file);
        setFile(file); // storing file
        uploadFile(file);
    }

    const uploadFile = (file) => {
        setProgress(0);

        const formData = new FormData();
        formData.append('username', file, sessionStorage.getItem('verifiedUsername'));
        formData.append('file', file); // appending file
        
        console.log("formdata:", formData);

        setCurrentFile(file);

        // 'props.uploadModel' is from Redux actionCreators, which is used to post the uploaded model to the backend server
        props.uploadModel(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, sessionStorage.getItem('verifiedUsername')).then(() => {
            setMessage("Uploaded successfully");
        })
        .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
        });
    };

    return (
        <Container>
            <Row>
                <div className="md-2">
                    {/*TODO: users may only be allowed to upload .dat => <input> needs to add accept=".dat* ref={el} */}
                    <input type="file" className="file-upload" id="file-upload" ref={el} onChange={handleChange} />
                    <label htmlFor="file-upload">
                        <IconButton aria-label="upload a model" component="span">
                            <PublishIcon />
                        </IconButton>
                    </label>
                </div>

                <div>
                    <div className="alert alert-light" role="alert">
                        {message}
                    </div>
                </div>
            </Row>


            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>
        </Container>
    );
}

export default ModelUpload;

