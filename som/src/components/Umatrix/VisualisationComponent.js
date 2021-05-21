import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Label } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';
import { Link } from 'react-router-dom';
import UMatrix from './Umatrix';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TableChartIcon from '@material-ui/icons/TableChart';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import { Drawer, IconButton, Modal } from '@material-ui/core';

const drawerWidth = '30%';

const useStyles = makeStyles((theme) => ({
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        overflow: 'auto'
    },
    drawerPaper: {
        width: drawerWidth,
        overflow: 'auto'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));

function SingleVisualisation(props) {
    const [inputValue, setInput] = useState('');
    const el = useRef(); // accesing input element
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();
    const theme = useTheme();

    const handleChange = (event) => {
        const userInput = event.target.value;
        const modelName = userInput.split(':');
        console.log("inputted model: ", modelName[0]);
        setInput(event.target.value.split(':')[0]);
    };

    const handleClick = () => {
        console.log("the current input value: ", inputValue);
        props.getUMatrixDatasets(inputValue, sessionStorage.getItem('verifiedUsername'));
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        const newValue = values.bindedModel.split(':');
        console.log(newValue);
        props.getUMatrixDatasets(newValue[0], sessionStorage.getItem('verifiedUsername'));
    };

    useEffect(() => {
        if (props.umatrixModelName !== undefined) {
            console.log("model namde defined", props.umatrixModelName);
            props.getUMatrixDatasets(props.umatrixModelName.FileName, sessionStorage.getItem('verifiedUsername'));
        }

        // if (props.umatrixDatasets.length !== 0) {
        //     console.log("props umatrix: ", props.umatrixDatasets);
        //     sessionStorage.setItem('umatrix-modelname', props.umatrixDatasets[0].FileName);
        // }

        /**
        return () => {
            console.log("willunmount")
            props.cleanUmatrixDatasets();
        } */
    });


    return (
        <Container style={{ overflow: 'auto' }}>
            <Row>
                <AppBar style={{ backgroundColor: "white" }} position="relative">
                    <Toolbar>
                        <Typography variant="h6" noWrap className="title col-md-18">
                            <h4>U-Matrix</h4>
                            {/* <h4>U-Matrix: {props.umatrixDatasets == undefined || props.umatrixDatasets.length == 0 ? "" : UmatrixModelName}</h4> */}
                        </Typography>
                        <Button aria-label="open drawer" edge="end"
                            onClick={handleDrawerOpen}
                            className={clsx(open && classes.hide)}>
                            SelectModel
                        </Button>
                    </Toolbar>
                </AppBar>
            </Row>

            <Row className="umatrix" style={{ paddingTop: '5%', width: "100vw" }}>
                {props.umatrixDatasets.length !== 0 && (<UMatrix hexagonSize={20} model={props.umatrixDatasets[0]} />)}
            </Row>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>

                <Divider />
                <br />
                {/* <InputGroup style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                    <Input ref={el} onChange={handleChange} placeholder="please input your model name" />
                    <InputGroupAddon addonType="append"><Button onClick={handleClick}>get model</Button></InputGroupAddon>
                </InputGroup>
                <Divider /> */}

                <LocalForm onSubmit={(values) => handleSubmit(values)}>
                    <Col className="form-group">
                        <Row>
                            <Col>
                                <Control.select model=".bindedModel" id="bindedModel" name="bindedModel"
                                    onChange={handleChange}
                                    className="form-control">
                                    <option>-----Please select a model-----</option>
                                    {props.modelFiles.map(eachModel => <option>{`${eachModel.FileName}: ${eachModel.BriefInfo}`}</option>)}
                                </Control.select>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Link to={`/visualisation/${inputValue}`}>
                            <Button type="submit">get umatrix</Button>
                        </Link>
                    </Col>
                </LocalForm>
                <br />
                <div>
                    {props.umatrixDatasets.length !== 0 &&
                        (<Card>
                            <CardBody>
                                <CardTitle><strong>Model:</strong></CardTitle>
                                {props.umatrixDatasets[0].FileName}
                                <CardText>
                                    <small className="text-muted">{props.umatrixDatasets[0].BriefInfo}</small>
                                </CardText>
                            </CardBody>

                            <CardBody>
                                <CardTitle><strong>Datasets:</strong></CardTitle>
                                {props.umatrixDatasets.length > 1 && props.umatrixDatasets.slice(1, props.umatrixDatasets.length).map(dataset =>
                                    <CardText>
                                        {dataset.FileName} <br />
                                        <small className="text-muted">{dataset.BriefInfo}</small>
                                    </CardText>
                                )}
                            </CardBody>
                        </Card>)}
                </div>
            </Drawer>
        </Container>
    );
}

export default SingleVisualisation;