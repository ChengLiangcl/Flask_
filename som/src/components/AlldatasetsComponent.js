import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal, TableRow } from '@material-ui/core';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Link } from 'react-router-dom';

import { Loading } from './LoadingComponent';
import DownloadFile from '../components/Modal/downloadFile';
import SearchAllDatasets from './SearchAllDatasets';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class AllDataset extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.props.fetchDatasetFiles();
  }

  // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
  // dataset: array. JSON data stored inside.
  tableHead(datasets) {
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

  tableBody(datasets) {
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
              <td key={"operateEachDataset"}>{this.operateDataset(true, eachDataset.FileName, eachDataset.UserName)}</td>
            </tr>
          )}
        </tbody>
      );
    }

  }

  //showOperate: bool. the delete button and the create button will be disable
  operateDataset(showOperate, fileName, userName) {
    if (showOperate) {
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

  render() {
    return (
      <Container>
        <Col>
          <Row>
            <div>
              <IconButton aria-label="visualisation" component="span">
                <ArrowBackIcon onClick={() => this.props.fetchDatasetFiles()} />
              </IconButton>
            </div>

            <Col className="search-box" >
              <SearchAllDatasets queryAllDatasets={this.props.queryAllDatasets} />
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

export default AllDataset;
