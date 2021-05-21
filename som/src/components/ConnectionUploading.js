import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Progress, Card, CardBody, CardTitle, CardText, Button, CardColumns } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PublishIcon from '@material-ui/icons/Publish';
import NeedUploading from './Modal/NeedUploading';

function ConnectionUploading(props) {
    const MODEL_REMIND = "Please upload your model. (only accept .cod)";
    const DATASET_REMIND = "Please upload your datasets. (only accept .dat, .txt, .csv, .xlsx)";
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [modelMessage, setModelMessage] = useState(MODEL_REMIND);
    const [message, setMessage] = useState(DATASET_REMIND);

    const [fileInfo, setFileInfos] = useState("");
    const [isModalOpen, setModal] = useState(false);

    const el = useRef(); // accesing input element

    const validModalFormat = "cod";
    const validDatasetFormat = ["dat", "txt", "csv", "xlsx"];
    const [model_message, setModelFail] = useState("");
    const [dataset_message, setDatasetFail] = useState("");

    const checkValidation = (file, reminder, message, setFail) => {
        let reader = new FileReader();
        console.log("file name: ", file.name);
        reader.onloadend = () => {
            let lines = reader.result.split('\n');
            try {
                const firstRow = lines[0].trim().split(" ");

                if (firstRow.length > 2) {
                    let line_check = parseFloat(firstRow[0]);
                    message = Number.isNaN(line_check) ? `Could not upload ${file.name}.#` : `${file.name} uploaded successfully!#`;
                    reminder += message;
                    console.log("check reminder: ", reminder);
                    setFail(reminder);
                }
                else {
                    message = `# Could not upload ${file.name}.#`;
                    reminder += message;
                    setFail(reminder);
                }

            }
            catch (e) {
                message = `# Could not upload ${file.name}.#`;
                reminder += message;
                setFail(reminder);
            }
        };

        reader.onerror = () => {
            message = `# Could not upload ${file.name}.#`;
            reminder += message;
            setDatasetFail(reminder);
        };

        reader.readAsText(file);
    };

    // It is for get the uploaded file you selected
    const handleModelChange = (event) => {
        const file = event.target.files[0]; // accessing file
        let modelMessage = '';
        let message = '';
        console.log("accepted model: ", file.name);
        if (file.name !== null || file.name !== undefined || file.name.length !== 0) {
            const acceptedModelArray = file.name.split(".");
            const modelExtension = acceptedModelArray.slice(acceptedModelArray.length - 1, acceptedModelArray.length)[0]
            if (modelExtension === validModalFormat) {
                checkValidation(file, modelMessage, message, setModelFail);
            } else {
                setModelFail("Could not upload the model. Please check your model format or the content!");
            }
            setSelectedModel(event.target.files[0]); // storing file
            //setFileInfos(file.name)
        }
    }

    const handleDatasetChange = (event) => {
        const files = event.target.files; // accessing file
        let datasetMessage = '';

        for (let file of files) {
            let message = '';

            const acceptedDatasetArray = file.name.split(".");
            const datasetExtension = acceptedDatasetArray.slice(acceptedDatasetArray.length - 1, acceptedDatasetArray.length)[0];
            if (validDatasetFormat.includes(datasetExtension)) {
                let reader = new FileReader();
                console.log("file name: ", file.name);
                reader.onloadend = () => {
                    let lines = reader.result.split('\n');
                    console.log("check lines: ", lines);
                    try {

                        if (datasetExtension === "txt" || datasetExtension == "dat") {
                            const firstRow = lines[0].trim().split(" ");
                            console.log("first row: ", firstRow);
                            console.log("first row: ", firstRow.length);

                            if (firstRow.length === 1) {
                                console.log("firs row len 1");
                                let line_check = parseFloat(firstRow[0]);
                                message = Number.isNaN(line_check) ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                                datasetMessage += message;
                                setDatasetFail(datasetMessage);
                            }
                            else {
                                console.log("firs row len not 1");
                                message = `# Could not upload ${file.name}. `;
                                datasetMessage += message;
                                setDatasetFail(datasetMessage);
                            }
                        }
                        else {
                            const firstRow = lines[0].trim().split(" ");
                            const secondRow = lines[1].trim().split(" ");

                            if (firstRow.length !== secondRow.length) {
                                message = `# Could not upload ${file.name}. `;
                                datasetMessage += message;
                                setDatasetFail(datasetMessage);
                            }
                            else {
                                const checkLine = secondRow.slice(0, secondRow.length - 1).map(elem => Number.isNaN(parseFloat(elem)) ? "noUpdate" : "update");
                                message = checkLine.includes("noUpdate") ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                                datasetMessage += message;
                                setDatasetFail(datasetMessage);
                            }
                        }


                    }
                    catch (e) {
                        message = `# Could not upload ${file.name}. `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                };

                reader.onerror = () => {
                    message = `# Could not upload ${file.name}. `;
                    datasetMessage += message;
                    setDatasetFail(datasetMessage);
                };

                reader.readAsText(file);
            }
            else {
                message = `# Could not upload ${file.name}. `;
                datasetMessage += message;
                setDatasetFail(datasetMessage);
            }

            // const acceptedDatasetArray = file.name.split(".");
            // const datasetExtension = acceptedDatasetArray.slice(acceptedDatasetArray.length - 1, acceptedDatasetArray.length)[0];
            // let message = validDatasetFormat.includes(datasetExtension) ? `# ${file.name} uploaded successfully!  ` : `# Could not upload ${file.name}.  `;

        }
        setSelectedFiles(files); // storing file
    }

    // We use selectedFiles for accessing current File as the first Item. 
    // Then we call UploadService.upload() method on the currentFile with a callback.
    const uploadModel = () => {
        setProgress(0);

        const formData = new FormData();

        formData.append('username', selectedModel, sessionStorage.getItem('verifiedUsername'));
        formData.append('model', selectedModel);

        if (selectedFiles !== undefined) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`file${i}`, selectedFiles[i]); // appending file
            }
        }

        // Display the keys
        for (var key of formData.keys()) {
            console.log(key);
        }

        console.log("selected file:", selectedFiles);
        setCurrentFile(selectedFiles);

        // 'props.uploadModel' is from Redux actionCreators, which is used to post the uploaded model to the backend server
        props.connectUploading(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, sessionStorage.getItem('verifiedUsername'))
            .then(() => console.log("I'm back"))
            .then((response) => {
                setModelMessage("Uploaded successfully");
                setMessage("Uploaded successfully");
                console.log("get connect names: ", props.connectionFiles);
            })
            .catch((res) => {
                setProgress(0);
                console.log("dataset", dataset_message);
                console.log(`model message: ${model_message}, dataset message: ${dataset_message}`)
                setModelMessage(model_message);
                if (model_message === "Could not upload the model. Please check your model format or the content!") {
                    setMessage("datasets are not allowed to be uploaded while model uploading fails");
                } else {
                    setMessage(dataset_message);
                }
            });
    };

    const handleUploadBtn = () => {
        if (selectedModel == undefined) {
            setModal(!isModalOpen);
        }
        else {
            uploadModel();
        }
    }

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    return (
        <Container>

            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>

            <Row>
                <Col md="9">
                    <Row>
                        <label htmlFor="file-upload">
                            <input type="file" id="file-upload" ref={el} onChange={handleModelChange} />
                            <div className="alert alert-light" role="alert">
                                {modelMessage.split("#").map(eachMessage =>
                                    <p>{eachMessage.includes("successfully") || eachMessage === MODEL_REMIND ? eachMessage : <div style={{ color: 'red' }}>{eachMessage}</div>}</p>
                                )}
                            </div>
                        </label>
                    </Row>
                </Col>

                <Col>
                    <Button
                        style={{ backgroundColor: "#378CC6" }}
                        disabled={!selectedModel}
                        onClick={handleUploadBtn}>
                        Upload
                    </Button>
                </Col>

            </Row>

            {/** datasets */}
            <Row>
                <Col md="5">
                    <Row>
                        <label htmlFor="file-upload">
                            <input type="file" multiple ref={el} onChange={handleDatasetChange} />
                            <div className="alert alert-light" role="alert">
                                {message.split("#").map(eachMessage =>
                                    <p>{eachMessage.includes("successfully") || eachMessage === DATASET_REMIND ? eachMessage : <div style={{ color: 'red' }}>{eachMessage}</div>}</p>
                                )}
                            </div>
                        </label>
                    </Row>
                </Col>

                <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                    <ModalHeader toggle={toggleModal}>Dataset Delete</ModalHeader>
                    <ModalBody>
                        <p>You have not selected any model. Please select one before uploading !</p>
                        <Row>
                            <Col>
                                <Button onClick={handleUploadBtn}>Got it!</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </Row>

            <Card>
                <CardBody>
                    <CardTitle>
                        <h5 className="center">Last Uploading History</h5>
                        <p style={{ color: "grey", fontSize: "small" }}>Notice: the file name will be automatically modified if there is a file with the same name in your database</p>
                    </CardTitle>
                </CardBody>
                <CardBody>
                    <CardTitle><strong>uploaded Model</strong></CardTitle>
                    <CardText>
                        <ListGroup>
                            <ListGroupItem className="justify-content-between">{props.connectionFiles[0]}</ListGroupItem>
                        </ListGroup>
                    </CardText>

                    <CardTitle><strong>uploaded Datasets</strong></CardTitle>
                    <CardText>
                        <ListGroup>
                            {props.connectionFiles[1].map((filename, index) => (
                                <ListGroupItem className="justify-content-between">{filename}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardText>
                </CardBody>
            </Card>
        </Container>
    );

}

export default ConnectionUploading;