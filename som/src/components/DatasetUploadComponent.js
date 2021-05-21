import React, { useState, useRef } from 'react';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { Row, Col, Container, Progress, Button } from 'reactstrap';

function DatasetUpload(props) {
    const DATASET_REMIND = "Please upload your datasets. (only accept .dat, .txt, .csv, .xlsx)";
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0); // tracking the status of uploading
    const [message, setMessage] = useState(DATASET_REMIND);
    const el = useRef(); // accesing input element

    const validDatasetFormat = ["dat", "txt", "csv", "xlsx"];
    const [dataset_message, setDatasetFail] = useState("1");

    // It is for get the uploaded file you selected
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
                        else{
                            const firstRow = lines[0].trim().split(" ");
                            const secondRow = lines[1].trim().split(" ");
 
                            if (firstRow.length !== secondRow.length){
                                message = `# Could not upload ${file.name}. `;
                                datasetMessage += message;
                                setDatasetFail(datasetMessage);
                            }
                            else{
                                const checkLine = secondRow.slice(0, secondRow.length-1).map( elem => Number.isNaN(parseFloat(elem)) ? "noUpdate" : "update");
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

    const handleUploadBtn = () => {
        uploadFile();
    }

    const uploadFile = () => {
        setProgress(0);

        //console.log("accepted dataset: ", selectedFiles);

        const formData = new FormData();
        formData.append('username', selectedFiles[0], sessionStorage.getItem('verifiedUsername'));
        if (selectedFiles !== undefined) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`file${i}`, selectedFiles[i]); // appending file
            }
        }

        // Display the keys
        for (var key of formData.keys()) {
            console.log(key);
        }

        setCurrentFile(selectedFiles);

        // 'props.uploadDataset' is from Redux actionCreators, which is used to post the uploaded dataset to the backend server
        props.uploadDataset(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, sessionStorage.getItem('verifiedUsername'))
            .then((response) => {
                setMessage("Uploaded successfully");
            })
            .catch(() => {
                setProgress(0);
                setMessage(dataset_message);
            });
    };

    return (
        <Container>
            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>

            {/** datasets */}
            <Row style={{ paddingTop: '2%' }}>
                <Col md="9">
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

                <Col>
                    <Button
                        style={{ backgroundColor: "#378CC6" }}
                        disabled={!selectedFiles}
                        onClick={handleUploadBtn}>
                        Upload
                    </Button>
                </Col>

            </Row>
        </Container>
    );
}

export default DatasetUpload;

