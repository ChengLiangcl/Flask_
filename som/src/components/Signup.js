import React, {useState} from 'react'
import {Grid, Paper, Avatar, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles';
import {questions} from '../others/constants'
import MenuItem from '@material-ui/core/MenuItem';


import {
  signUp, updateUser
} from '../redux/ActionCreators';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";

const mapDispatchToProps = dispatch => ({
  signUp: (data, cb) => {
    dispatch(signUp(data, cb))
  },
});

const Signup = (props) => {
  const paperStyle = {padding: 20, height: '90vh auto', margin: "20px auto"}
  let myStyle = {
    color: '#6495ED',
    fontSize: '48px',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
  let username = {
    margin: '10px',
  }
  let password = {
    margin: '10px'
  }
  let confirmpassword = {
    margin: '10px'
  }
  let button = {
    margin: '20px',
    fontSize: '24px',
  }
  const initialValues = {
    password: '',
    confirmpassword: '',
    email: '',
    question: questions[0],
    answer: '',
  }
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("*Required!"),
    password: Yup.string().min(8, "The password length should be at least 8 digits ").required("*Required!"),
    confirmpassword: Yup.string().oneOf([Yup.ref('password')], "Password not matched").required("*Required!"),
    question: Yup.string().required("*Required!"),
    answer: Yup.string().required("*Required!"),
  })

  const [isModalOpen, setModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handlenNoBtn = () => {
    setModal(!isModalOpen);
  };


  const onSubmit = (values) => {
    console.log(values)
    props.signUp(values, res => {
      setModal(true)
      console.log(res);
      setModalContent(res.toString())
    })
  }
  return (

    <Paper elevation={10} style={paperStyle}>
      <Grid>
        <div style={myStyle}> SOM</div>
        <h3>Sign Up</h3>
        <Typography variant='caption'>Please register your own account</Typography>
      </Grid>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <Field as={TextField}
                   id="outlined-email-input"
                   name="email"
                   label="username"
                   type="search"
                   autoComplete="current-password"
                   helperText={
                     <ErrorMessage name="email">
                       {msg => <div style={{color: 'red'}}>{msg}</div>}
                     </ErrorMessage>
                   }
                   variant="outlined"/>

            <div style={password}>
              <Field as={TextField}
                     id="outlined-password-input"
                     name="password"
                     label="password"
                     type="password"
                     autoComplete="current-password"
                     helperText={
                       <ErrorMessage name="password">
                         {msg => <div style={{color: 'red'}}>{msg}</div>}
                       </ErrorMessage>
                     }
                     variant="outlined"/>
            </div>
            <div style={confirmpassword}>
              <Field as={TextField}
                     id="outlined-confirmpassword-input"
                     name="confirmpassword"
                     label="confirm password"
                     type="password"
                     autoComplete="current-password"
                     helperText={
                       <ErrorMessage name="confirmpassword">
                         {msg => <div style={{color: 'red'}}>{msg}</div>}
                       </ErrorMessage>
                     }
                     variant="outlined"/>
            </div>

            <div style={username}>
              <Field as={(props)=><Select style={{width:195}} {...props}>
                {questions.map(item=> <MenuItem value={item}>{item}</MenuItem>)}
              </Select>}
                     name="question"
                     label="question"
                     helperText={
                       <ErrorMessage name="question">
                         {msg => <div style={{color: 'red'}}>{msg}</div>}
                       </ErrorMessage>
                     }
                     variant="outlined"/>
            </div>
            <div style={username}>
              <Field as={TextField}
                     id="outlined-answer-input"
                     name="answer"
                     label="answer"
                     helperText={
                       <ErrorMessage name="answer">
                         {msg => <div style={{color: 'red'}}>{msg}</div>}
                       </ErrorMessage>
                     }
                     variant="outlined"/>
            </div>
            <div style={button}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign Up
              </Button>
            </div>

          </Form>
        )}


      </Formik>
      <Modal isOpen={isModalOpen} centered={true}>
        <ModalBody>
          <p>{modalContent}</p>
          <Row>
            <Col>
              <Button onClick={handlenNoBtn}>Ok</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Paper>


  )
}
export default withRouter(connect(null, mapDispatchToProps)(Signup));
