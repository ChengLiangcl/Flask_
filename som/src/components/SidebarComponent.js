import React, {Component, useEffect} from 'react';
import { Card, CardImg, Media } from 'reactstrap';
import { Container } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import {useHistory} from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {updateUser} from '../redux/ActionCreators'


function Sidebar(props){
  const dispatch = useDispatch()
  const history = useHistory()
    useEffect(()=>{
      if(!props.username){
        history.replace('/login')
      }
    },[])
    return (
        <div className="col col-md">
          <div style={{textAlign:'center', fontSize:13, color: 'grey'}}>{props.username}<span onClick={()=>{
            dispatch(updateUser(null));
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("password");
            sessionStorage.removeItem("verifiedUsername");
            history.replace('/login');
          }} style={{marginLeft:24,paddingLeft:24, fontSize:13, borderLeft:'1px solid',color:'#378CC6',cursor:'pointer'}}>sign out</span></div>
            <div className="side-group">
                <ListGroup className="side-items" flush>
                    <Media className="logo" src={'/assets/logo.png'} alt={'som log'}/>
                    {/** 
                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/uploading">
                            <span className="slide-icon fa fa-database"></span>
                            &nbsp;Uploading
                        </NavLink>
                    </ListGroupItem>
                    */}
                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/mymodels">
                            <span className="slide-icon fa fa-cubes"></span>
                            My models
                        </NavLink>
                    </ListGroupItem>

                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/mydatabase">
                            <span className="slide-icon fa fa-database"></span>
                            &nbsp;My datasets
                        </NavLink>
                    </ListGroupItem>
                      
                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/visualisation">
                            <span className="slide-icon fa fa-area-chart"></span>
                            Visualisation
                            </NavLink>
                    </ListGroupItem>
                           
                </ListGroup>
            </div>
        </div>
    );

}

export default Sidebar;
