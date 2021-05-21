import React, { Component } from 'react';
import { InputGroup, Modal, ModalHeader, ModalBody, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import InsertChart from '@material-ui/icons/InsertChart';
import { Link } from 'react-router-dom';
import ModelUploadComponent from './ModelUploadComponent';
import DeleteOneModel from './DeleteOneModel';
import ModelBriefInfo from './ModelBriefInfo';
import { Loading } from './LoadingComponent';
import ConnectUploading from './Modal/ConnectionUploading'
import SearchModel from './SearchModelComponent';
import SearchAllModel from './SearchAllModels';

import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const AllModelSwitch = withStyles({
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



class SOMModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkAllModels: this.props.isAllQuery? true : false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState(state => ({ ...state, [event.target.name]: event.target.checked }));
  }

  componentDidUpdate() {
    if (this.props.isQuery || this.props.isAllQuery) {
      this.props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'));
      this.props.fetchAllModels();
    }

  }


  tableHead() {
    return (
      <thead>
        <tr>
          <th width="10%">Model name</th>
          <th width="18%">Description</th>
          <th width="8%">Size(KB)</th>
          <th width="10%">Operation</th>
        </tr>
      </thead>
    );
  }

  tableBody(models) {
    if (models.length === 0) {
      return (
        <tbody />
      );
    }
    else {
      return (
        <tbody>
          {models.map((model, index) =>
            <tr key={index}>
              <Link style={{ color: "black" }} to={`/mymodels/${model.FileName}`}>
                <td style={{ verticalAlign: 'middle' }}>
                  {model.FileName}
                </td>
              </Link>
              <td style={{ verticalAlign: 'middle' }}>{model.BriefInfo}</td>
              <td style={{ verticalAlign: 'middle' }}>{model.Size}</td>
              <td key={"operateEachModel"}>
                <Container>
                  <Row>
                    <DeleteOneModel deleteModel={this.props.deleteModel}
                      deletedFileName={model.FileName} />

                    <ModelBriefInfo editModelDescription={this.props.editModelDescription}
                      modelName={model.FileName}
                      fetchModelFiles={this.props.fetchModelFiles} />

                    <Link to={`/visualisation/${model.FileName}`}>
                      <IconButton aria-label="visualisation" component="span">
                        <InsertChart />
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

  allTableHead() {
    return (
      <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
        <tr>
          <th width="12%">Model name</th>
          <th width="20%">Description</th>
          <th width="12%">User name</th>
          <th width="8%">Operation</th>
        </tr>
      </thead>
    );
  }

  allTableBody(models) {
    if (models.length === 0) {
      return (
        <tbody />
      );
    }
    else {
      return (
        <tbody>
          {models.map((model, index) =>
            <tr key={index}>
              <Link style={{ color: "black" }} to={`/allmodels/${model.FileName}?userName=${model.UserName}&fileName=${model.FileName}`}>
                <td style={{ verticalAlign: 'middle' }}>
                  {model.FileName}
                </td>
              </Link>
              <td style={{ verticalAlign: 'middle' }}>{model.BriefInfo}</td>
              <td style={{ verticalAlign: 'middle' }}>{model.UserName}</td>
              <td key={"operateEachModel"}>

                <Container>
                  <Row>
                    <Link to={`/visualisation/${model.FileName}`}>
                      <IconButton aria-label="visualisation" component="span">
                        <InsertChart />
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

  renderModelTable(models = [], isLoading, isQuery) {
    if (isLoading) {
      return (
        <Loading />
      );
    }
    else if (isQuery) {
      return (
        <div>
          <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
            {this.tableHead()}
            {this.tableBody(models)}
          </Table>
          <p style={{ color: '#378CC6', fontSize: '12px' }}>Query result: {models.length} models are found</p>
        </div>
      );
    }
    else {
      return (
        <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
          {this.tableHead()}
          {this.tableBody(models)}
        </Table>
      );
    }
  }

  renderAllModelTable(models = [], isLoading, isQuery) {
    if (isLoading) {
      return (
        <Loading />
      );
    }
    else if (isQuery){
      return(
        <div>
          <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
            {this.allTableHead()}
            {this.allTableBody(models)}
          </Table>
          <p style={{ color: '#378CC6', fontSize: '12px' }}>Query result: {models.length} models are found</p>
        </div>
      );
    }
    else {
      return (
        <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
          {this.allTableHead()}
          {this.allTableBody(models)}
        </Table>
      );
    }
  }

  render() {
    console.log("switch state: ", this.state.checkAllModels);
    if (this.state.checkAllModels) {
      return (
        <Container>
          <Col className="search-box" >
            <SearchAllModel queryAllModels={this.props.queryAllModels} />
          </Col>

          <Col>
            <Row>
              <Col md="9">
              </Col>
              <Col md="3">
                <FormGroup>
                  <FormControlLabel
                    control={<AllModelSwitch checked={this.state.checkAllDatasets} onChange={this.handleChange} name="checkAllModels" />}
                    label="All models"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>

          <Col className="database">
            {this.renderAllModelTable(this.props.allModels, false, this.props.isAllQuery)}
          </Col>

        </Container>
      );
    }
    else {
      return (
        <Container>
          <Col className="search-box" >
            <SearchModel queryModels={this.props.queryModels} />
          </Col>

          <Col>
            <Row>
              <Col md="9">
                <ConnectUploading connectUploading={this.props.connectUploading}
                  connectionFiles={this.props.connectionFiles}
                  clearConnectionFiles={this.props.clearConnectionFiles}
                  fetchModelFiles={this.props.fetchModelFiles}
                  fetchDatasetFiles={this.props.fetchDatasetFiles} />
              </Col>
              <Col md="3">
                <FormGroup>
                  <FormControlLabel
                    control={<AllModelSwitch onChange={this.handleChange} name="checkAllModels" />}
                    label="All models"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>

          <Col className="database">
            {this.renderModelTable(this.props.modelFiles, false, this.props.isQuery)}
          </Col>

        </Container>
      );
    }
  }
}

export default SOMModel;
