import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ModelBinding from './Modal/BindModel';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Link } from 'react-router-dom';

import DatasetUpload from './DatasetUploadComponent';
import DatasetUploading from './Modal/DatasetUploading';
import DeleteOneDataset from './DeleteOneDataset';
import DownloadFile from '../components/Modal/downloadFile';
import { Loading } from './LoadingComponent';
import MetadataForm from './MetadataForm';
import SearchFile from './searchFileComponent';
import SearchAllDatasets from './SearchAllDatasets';

import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const AllDatasetSwitch = withStyles({
    switchBase: {
        color: '#FFF1CC',
        '&$checked': {
            color: '#FFD466',
        },
        '&$checked + $track': {
            backgroundColor: '#FFD466',
        },
    },
    checked: {},
    track: {},
})(Switch);

class Database extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false,
            checkAllDatasets: this.props.isAllQuery === true ? true : false
        };
        console.log("hhhh", JSON.stringify(this.props.isAllQuery))
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState(state => ({ ...state, [event.target.name]: event.target.checked }));
    }

    componentDidUpdate() {
        if (this.props.isQuery || this.props.isAllQuery) {
            this.props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
            this.props.fetchAllDatasetFiles();
        }
        
    }

    // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
    // dataset: array. JSON data stored inside.
    tableHead(datasets) {
        if (datasets !== undefined) {
            return (
                <thead>
                    <tr>
                        <th width="10%">File name</th>
                        <th width="18%">Description</th>
                        <th width="8%">Size</th>
                        <th width="14%">Operation</th>
                    </tr>
                </thead>
            );
        }

        return (
            <div>The table for storing uploaded datasets does not exist</div>
        );
    }

    //TODO: may change if the design of the database is changed
    tableBody(datasets) {
        // when there is no uploaded dataset in the database
        console.log(`dataset length: ${datasets.length}, dataset is ${datasets}`)
        if (datasets.length === 0) {
            return (
                <tbody />
            );
        }
        else { // where are dataset stored in the database
            return (
                <tbody>
                    {datasets.map((eachDataset, index) =>
                        <tr key={index}>
                            <td key={'dataset name'}>{eachDataset.FileName}</td>
                            <td key={'dataset briefInfo'}>{eachDataset.BriefInfo}</td>
                            <td key={'dataset size'}>{eachDataset.Size}</td>
                            <td key={"operateEachDataset"}>{this.operateDataset(true, eachDataset.FileName, eachDataset.ModelName, eachDataset.UserName)}</td>
                        </tr>
                    )}
                </tbody>
            );
        }

    }

    //showOperate: bool. the delete button and the create button will be disable
    operateDataset(showOperate, fileName, bindModelName, userName) {
        console.log("dataset comp: ", userName);
        if (showOperate) {
            return (
                <Container>
                    <Row>
                        <DeleteOneDataset deleteDataset={this.props.deleteDataset}
                            deletedFileName={fileName} />

                        <Link to={`/metadata-form/${fileName}`}>
                            <IconButton aria-label="create matadata" component="span">
                                <CreateIcon />
                            </IconButton>
                        </Link>

                        <ModelBinding modelFiles={this.props.modelFiles} datasetName={fileName}
                            bindModel={this.props.bindModel} bindedModelName={bindModelName} />

                        <DownloadFile downloadFile={this.props.downloadFile} datasetName={fileName} userName={userName} />
                    </Row>
                </Container>
            );
        }
        else {
            return (
                <Container>
                    <Row>
                        <Link to={`/alldataset/${fileName}?userName=${userName}&fileName=${fileName}`}>
                            <IconButton aria-label="detailed data" component="span">
                                <TableChartIcon />
                            </IconButton>
                        </Link>

                        <DownloadFile downloadFile={this.props.downloadFile} datasetName={fileName} userName={userName} />
                    </Row>
                </Container>
            );
        }
    }

    renderDatasetTable(datasets, isLoading, errMess, isQuery) {
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
        else if (isQuery) {
            return (
                <div>
                    <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
                        {this.tableHead(datasets)}
                        {this.tableBody(datasets)}
                    </Table>
                    <p style={{ color: '#378CC6', fontSize: '12px' }}>Query result: {datasets.length} datasets are found</p>
                </div>
            );
        }
        else {
            return (
                <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
                    {this.tableHead(datasets)}
                    {this.tableBody(datasets)}
                </Table>
            );
        }
    }

    allTableHead(datasets) {
        if (datasets !== undefined) {
            return (
                <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
                    <tr>
                        <th width="12%">File name</th>
                        <th width="20%">Description</th>
                        <th width="12%">User name</th>
                        <th width="8%">Operation</th>
                    </tr>
                </thead>
            );
        }

        return (
            <div>The table for storing uploaded datasets does not exist</div>
        );
    }

    allTableBody(datasets) {
        // when there is no uploaded dataset in the database
        if (datasets.length === 0) {
            return (
                <tbody />
            );
        }
        else { // where are dataset stored in the database
            return (
                <tbody>
                    {datasets.map((eachDataset, index) =>
                        <tr key={index}>
                            <td key={'name'}>{eachDataset.FileName}</td>
                            <td key={'Description'}>{eachDataset.Description}</td>
                            <td key={'Username'}>{eachDataset.UserName}</td>
                            <td key={"operateEachDataset"}>{this.operateDataset(false, eachDataset.FileName, " ", eachDataset.UserName)}</td>
                        </tr>
                    )}
                </tbody>
            );
        }

    }

    renderAllDatasetTable(datasets, isLoading, errMess, isQuery) {
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
        else if (isQuery) {
            return (
                <div>
                    <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
                        {this.allTableHead(datasets)}
                        {this.allTableBody(datasets)}
                    </Table>
                    <p style={{ color: '#378CC6', fontSize: '12px' }}>Query result: {datasets.length} datasets are found</p>
                </div>
            );
        }
        else {
            return (
                <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
                    {this.allTableHead(datasets)}
                    {this.allTableBody(datasets)}
                </Table>
            );
        }
    }

    render() {
        console.log("switch state: ", this.state.checkAllDatasets)
        console.log("check query datasets: ", this.props.isAllQuery)
        if (this.state.checkAllDatasets) {
            return (
                <Container>
                    <Col className="search-box" >
                        <SearchAllDatasets queryAllDatasets={this.props.queryAllDatasets} />
                    </Col>

                    <Col>
                        <Row>
                            <Col md="9">
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <FormControlLabel
                                        control={<AllDatasetSwitch checked={this.state.checkAllDatasets} onChange={this.handleChange} color="primary" name="checkAllDatasets" />}
                                        label="All datasets"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>

                    <Col className="database">
                        {this.renderAllDatasetTable(this.props.allDatasetFiles, this.props.isAllLoading, this.props.allErrMess, this.props.isAllQuery)}
                    </Col>
                </Container>
            );
        }
        else {
            return (
                <Container>
                    <Col className="search-box" >
                        <SearchFile queryDatasets={this.props.queryDatasets} />
                    </Col>

                    <Col>
                        <Row>
                            <Col md="9">
                                <DatasetUploading uploadDataset={this.props.uploadDataset} fetchDatasetFiles={this.props.fetchDatasetFiles} />
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <FormControlLabel
                                        control={<AllDatasetSwitch checked={this.state.checkAllDatasets} onChange={this.handleChange} name="checkAllDatasets" />}
                                        label="All datasets"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>

                    <Col className="database">
                        {this.renderDatasetTable(this.props.datasetFiles, this.props.isLoading, this.props.errMess, this.props.isQuery)}
                    </Col>
                </Container>
            );
        }

    }
}

export default Database;