import GetAppIcon from '@material-ui/icons/GetApp';
import { Modal, ModalHeader, ModalBody, Button, Row, Col, Label, Input } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const options = ['.txt', '.dat', '.csv'];

function DownloadFile(props) {
    //const [isModalOpen, setModal] = useState(false);

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleMenuItemClick = (event, index) => {
        let filename = props.datasetName.split(".")[0] + options[index];
        console.log("download filename is : ", filename);

        downloading(props.datasetName, filename, options[index]);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    // const toggleModal = () => {
    //     setModal(!isModalOpen);
    // };

    // // while a user chooses not to delete a dataset
    // const handlenNoBtn = () => {
    //     setModal(!isModalOpen);
    // };

    const handleDownload = () => {
        downloading();
    };

    const downloading = (datasetName, downloadName, downloadType) => {
        props.downloadFile(datasetName, downloadName, downloadType, props.userName)
    };


    return (
        <div>
                <IconButton
                    ref={anchorRef}
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                     <GetAppIcon/>
                </IconButton>

            <Popper style={{zIndex: "3"}} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

            {/* <IconButton aria-label="delete a dataset" component="span">
                <GetAppIcon onClick={handleDownload} />
            </IconButton> */}

            {/* <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Bind Model</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => handleSubmit(values)}>
                        <input type="file" onChange={onChange} />
                        <Col>
                            <Button type="submit" onClick={handlenNoBtn}>Bind</Button>
                        </Col>
                    </LocalForm>
                </ModalBody>
            </Modal> */}
        </div>

    );
}

export default DownloadFile;
