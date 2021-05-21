import React, { Component } from 'react';
import { InputGroup, Modal, ModalHeader, ModalBody, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton } from '@material-ui/core';
import InsertChart from '@material-ui/icons/InsertChart';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import SearchAllModel from './SearchAllModels';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


class AllModel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.isAllQuery) {
      console.log("please refresh")
      this.props.fetchAllModels();
    }
  }


  tableHead() {
    return (
      <thead style={{ backgroundColor: '#FFE399', color: "black" }}>
        <tr>
          <th width="10%">Model name</th>
          <th width="18%">Description</th>
          <th width="8%">User name</th>
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

  render() {
    console.log("model query: ", this.props.isAllQuery)
    return (
      <Container>
        <Col>
          <Row>
            <div>
              <IconButton aria-label="visualisation" component="span">
                <ArrowBackIcon onClick={() => this.props.fetchAllModels()} />
              </IconButton>
            </div>

            <Col className="search-box" >
              <SearchAllModel queryAllModels={this.props.queryAllModels} />
            </Col>
          </Row>
        </Col>

        <Col className="database">
          {this.renderModelTable(this.props.allModels, false, this.props.isAllQuery)}
        </Col>

      </Container>
    );
  }
}

export default AllModel;
