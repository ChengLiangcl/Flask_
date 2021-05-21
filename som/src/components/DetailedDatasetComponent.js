import React, { Component, useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Table } from 'reactstrap';
import { Loading } from './LoadingComponent';
import qs from 'querystring';
import { Link } from 'react-router-dom';

const RenderDetailedData = ({ detailedData, isLoading, errMess }) => {
    // pass the datasetName to the backend server

    if (isLoading) {
        return (
            <Loading />
        );
    }
    else if (errMess) {
        return (
            <h4>{errMess}</h4>
        );
    }
    else {
        console.log("detailed data is:");
        console.log(detailedData);
        const colName = Object.keys(detailedData[Object.keys(detailedData)[0]]);
        console.log("colname is " + colName);
        return (
            <Table striped>
                <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
                    <tr key="tbhead">
                        {colName.map(col =>
                            <th key={col}>{col}</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(detailedData).map(row => // [row1, row2, row3, row4, row5]
                        <tr>
                            {Object.values(detailedData[row]).map(value =>
                                <td>{value}</td>
                            )}
                        </tr>
                    )}
                </tbody>

            </Table>
        );
    }
};

const RenderMetadata = ({ metadata, isLoading, errMess, fileName }) => {
    console.log("check metadata");
    console.log(JSON.stringify(metadata));
    console.log("check filename: ", fileName)
    if (isLoading) {
        return (
            <Loading />
        );
    }
    else if (errMess) {
        return (
            <h4>{errMess}</h4>
        );
    }
    else {
        return (
            <Container>
                <Row>
                    <Table size="sm">
                        <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
                            <tr>
                                <th>#</th>
                                <th>Metadata: {fileName}</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Dataset description:</td>
                                <td>{metadata.Description}</td>
                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>Source:</td>
                                <td>{metadata.Source}</td>
                            </tr>

                            <tr>
                                <th scope="row">3</th>
                                <td>Number of instances</td>
                                <td>{metadata.Number_of_Instance}</td>
                            </tr>

                            <tr>
                                <th scope="row">4</th>
                                <td>Number of attributes:</td>
                                <td>{metadata.Number_of_Attribute}</td>
                            </tr>

                            <tr>
                                <th scope="row">6</th>
                                <td>Keywords:</td>
                                <td>{metadata.Keywords.length === 0 ? "" : JSON.stringify(metadata.Keywords)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>

                <Row>
                    <Table size="sm">
                        <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
                            <tr>
                                <th>Attributes</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metadata.AttrInfo.map((eachAttr, index) =>
                                <tr key={index}>
                                    {Object.values(eachAttr).map(eachValue => <td key={eachValue}>{eachValue}</td>)}
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
};


const DetailedDataset = (props) => {
    //const FileName = localStorage.getItem('datasetname-detaileddata');
    const query = qs.parse(window.location.search.split('?')[1] || '')
    const FileName = query.fileName;
    console.log("local get file name: ", FileName);
    console.log("local get user name: ", query.userName);

    useEffect(() => {
        props.sendNameForDetailedData(FileName, query.userName);
    });

    //useEffect(() => {
    //props.sendNameForDetailedData(props.selectedDataset, sessionStorage.getItem('verifiedUsername'));
    //});

    return (
        <Container>
            <Col>
                <Breadcrumb>
                    <BreadcrumbItem><Link style={{ color: "grey" }} to="/alldataset">All datasets</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{FileName}</BreadcrumbItem>
                </Breadcrumb>
            </Col>
            <Col className="detailed-metadata" >
                <Col>
                    <RenderMetadata metadata={props.metadata} isLoading={props.isLoading_metadata} errMess={props.errMess_metadata}
                        fileName={FileName} />
                </Col>
            </Col>

            <Col className="detailed-database">
                <RenderDetailedData detailedData={props.detailedData} isLoading={props.isLoading_detailedData} errMess={props.errMess_detailedData} />
            </Col>
        </Container>
    );
};

export default DetailedDataset;