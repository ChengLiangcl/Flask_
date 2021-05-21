import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Label } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';
import { Link } from 'react-router-dom';
import UMatrix from './Umatrix/Umatrix';
import { getSOM } from '../somJS/SOM';

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

function Visualisation(props) {
    const [inputValue, setInput] = useState('');
    const el = useRef(); // accesing input element

    const handleChange = (event) => {
        const userInput = event.target.value;
        const modelName = userInput.split(':');
        console.log("inputted model: ", modelName[0]);
        setInput(event.target.value.split(':')[0]);
    };

    const [open, setOpen] = React.useState(true);
    const classes = useStyles();
    const theme = useTheme();

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
            </Drawer>
        </Container>
    );
}

export default Visualisation;