import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';

import {
  login, updateUser
} from '../redux/ActionCreators';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = dispatch => ({
  login: (data) => { dispatch(login(data)) },
  updateUser: (data) => { dispatch(updateUser(data)) },
});

const Login = ({ handleChange, ...props }) => {
  const paperStyle = { padding: 20, height: '70vh auto', margin: "20px auto" }
  let myStyle = {
    color: '#6495ED',
    fontSize: '48px',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
  let root = {
    '& .MuiTextField-root': {
      margin: '20ch',
      width: '25ch',
    }
  }
  let username = {
    margin: '30px'
  }
  let button = {
    margin: '30px',
    fontSize: '24px',
  }
  const initialValues = {
    username: '',
    password: ''

  }
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("*Required!"),
    password: Yup.string().required("*Required!")

  })
  const [user, setUser] = useState('')
  const onSubmit = (values) => {
    console.log("check username and password", values)
    // save into the local session
    console.log(values.username)
    sessionStorage.setItem('username', values.username);
    sessionStorage.setItem('password', values.password)
    const loginInfo = { username: sessionStorage.getItem('username'), password: sessionStorage.getItem('password') };
    console.log("userInfo ", loginInfo);
    setUser(loginInfo.username);
    props.login(loginInfo);
  }

  const [isModalOpen, setModal] = useState(false);

  const handlenNoBtn = () => {
    setModal(!isModalOpen);
    //location.reload()
    props.updateUser(null)
  };



  useEffect(() => {
    console.log("helllloo");
    console.log(123, sessionStorage.getItem('verifiedUsername'));
    if (sessionStorage.getItem('verifiedUsername') != undefined || sessionStorage.getItem('verifiedUsername') !== null){
      props.updateUser(sessionStorage.getItem('verifiedUsername'));
    }
    
    if (props.user.userInfo) {
      console.log(props.user.userInfo);
      if (sessionStorage.getItem('verifiedUsername') === sessionStorage.getItem('username')) {
        props.history.replace('/');
      } else {
        setModal(!isModalOpen);
      }
      //弹出一个警示，告诉用户登陆失败

    }
  }, [props.user.userInfo])

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <div style={myStyle}> SOM </div>
        <h3>Sign In</h3>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {(props) => (
            <Form>
              <div>
                <div style={username}>
                  <Field as={TextField}
                    id="outlined-search"
                    label="username"
                    name="username"
                    type="search"
                    helperText={
                      <ErrorMessage name="username" />
                    }
                    variant="outlined" />
                </div>

                <div>
                  <Field as={TextField}
                    id="outlined-password-input"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    helperText={
                      <ErrorMessage name="password" />
                    }
                    variant="outlined" />
                </div>

              </div>
              <div style={button}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Sign In
                      </Button>
              </div>
            </Form>
          )}


        </Formik>

        <div style={button}>


          <Typography> don't have an account yet?
                <Link href="#" onClick={() => handleChange("event", 1)}>
              Sign up
                </Link>
          </Typography>
        </div>
        <div style={button}>
          <Typography> forget password?
            <Link onClick={() => props.history.push('/password')}>
              click here!
            </Link>
          </Typography>
        </div>
      </Paper>
      <Modal isOpen={isModalOpen} centered={true}>
        <ModalHeader>warning!</ModalHeader>
        <ModalBody>
          <p>Username and password do not match</p>
          <Row>
            <Col>
              <Button onClick={handlenNoBtn}>Ok</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Grid>


  )

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
