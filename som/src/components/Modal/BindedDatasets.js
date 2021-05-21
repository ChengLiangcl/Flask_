import { Modal, ModalHeader, ModalBody, Button, Row, Col, Container, Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteOneDataset from '../DeleteOneDataset';
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { Loading } from '../LoadingComponent';
import ModelBriefInfo from '../ModelBriefInfo';
import InsertChart from '@material-ui/icons/InsertChart';

function BindedDatasets(props) {
    const ModelName = localStorage.getItem('modelname') == undefined ? props.modelName : localStorage.getItem('modelname');
    console.log("local get model name: ", ModelName);

    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    const tableHead = () => {
        return (
            <thead style={{backgroundColor: "lightgray", color: "black"}}>
                <tr>
                    <th>File name</th>
                    <th>Description</th>
                    <th>Operation</th>
                </tr>
            </thead>
        );
    }

    const tableBody = (bindedDatasets) => {
        if (bindedDatasets.length === 0) {
            return (
                <tbody>
                    <div>No any binded datasets!</div>
                </tbody>
            );
        } else {
            console.log("get bindedDatasets: ", bindedDatasets);
            return (
                <tbody>
                    <tr style={{backgroundColor: "#F2F2F2"}} key="model">
                        <td style={{ verticalAlign: 'middle' }}>{bindedDatasets[0].FileName}</td>
                        <td style={{ verticalAlign: 'middle' }}>{bindedDatasets[0].BriefInfo}</td>
                        <td key={"operateEachDataset"}>
                            <Container>
                                <Row>
                                    <ModelBriefInfo editModelDescription={props.editModelDescription}
                                        modelName={bindedDatasets[0].FileName}
                                        fetchModelFiles={props.fetchModelFiles} />

                                    <Link to={`/visualisation/${bindedDatasets[0].FileName}`}>
                                        <IconButton aria-label="visualisation" component="span">
                                            <InsertChart />
                                        </IconButton>
                                    </Link>
                                </Row>
                            </Container>
                        </td>
                    </tr>
                    {bindedDatasets.slice(1, bindedDatasets.length).map((dataset, index) =>
                        <tr key={index}>
                            <td style={{ verticalAlign: 'middle' }}>{dataset.FileName}</td>
                            <td style={{ verticalAlign: 'middle' }}>{dataset.BriefInfo}</td>
                            <td key={"operateEachDataset"}>
                                <Container>
                                    <Row>
                                        <DeleteOneDataset deleteDataset={props.deleteDataset}
                                            deletedFileName={dataset.FileName} />

                                        <Link to={`/metadata-form/${dataset.FileName}`}>
                                            <IconButton aria-label="create matadata" component="span">
                                                <CreateIcon />
                                            </IconButton>
                                        </Link>
                                    </Row>
                                </Container>
                            </td>
                        </tr>
                    )}
                </tbody>
            );
        }
    }

    const renderModelTable = (bindedDatasets, isLoading) => {
        console.log("check loading", isLoading);
        console.log("checked binded dataset: ", bindedDatasets);
        if (isLoading) {
            return (
                <Loading />
            );
        } else {
            return (
                <Table hover size="sm">
                    {tableHead()}
                    {tableBody(bindedDatasets)}
                </Table>
            );
        }
    }

    useEffect(() => {
        // fetch the existing metadata first
        console.log("start refreshing binded datasets", props.bindedDatasets);
        props.getBindedDatasets(ModelName, sessionStorage.getItem('verifiedUsername'));
    }, [props.bindedDatasets]);

    return (
        <Container>
            <Row>
                <Breadcrumb>
                    <BreadcrumbItem><Link style={{color: "grey"}}to="/mymodels">My Models</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Binded datasets of {ModelName}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12" style={{ paddingTop: '5%' }}>
                    <h4 style={{color: "grey"}}>All binded datasets of {ModelName}</h4>
                    <hr />
                </div>
            </Row>
            <Row>
                {renderModelTable(props.bindedDatasets, false)}
            </Row>
        </Container>

    );
}

export default BindedDatasets;