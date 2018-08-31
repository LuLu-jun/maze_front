import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { login } from '../redux/actions'
import { API_LOGIN_URL } from "../URL";
import './Login.css';

var id = '';
var pwd = '';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state={
            redirect: false,
        };
        this.onKeyPress = this.onKeyPress.bind(this);
        this.tryLogin = this.tryLogin.bind(this);
        this.tryLogin();
    }

    onKeyPress(event){
        if (event.key === 'Enter'){
            this.tryLogin();
        }
    }

    tryLogin() {
        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';

        if (id == '' && pwd ==''){
            if (cookieId == '' && cookiePwd == '') { return; }
            id = cookieId;
            pwd = cookiePwd;
        }

        axios.post(API_LOGIN_URL, {
            id: id,
            pwd: pwd,
        })
            .then( response => {
                var data = response.data;
                if (data.result == 0) { alert(data.error); }
                else {
                    const isAdmin = data.isAdmin;
                    this.props.loginSuccess(id, isAdmin);
                    this.props.cookies.set('id', id, {path: '/'});
                    this.props.cookies.set('pwd', pwd, {path: '/'});

                    id = '';
                    pwd = '';

                    this.setState({
                        redirect: true,
                    });
                }
            })
            .catch( response => { alert(response); });
    }

    render() {
        if (this.state.redirect){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.containerStyle}>
                <div className="boxGroup" style={styles.boxGroupStyle}>
                    <div className="idBox" style={styles.boxStyle}>
                        <h4 className="idLabel" style={styles.boxLabelStyle}>ID</h4>
                        <input type="text" style={styles.boxInputStyle} onChange={(event) => {
                            id = event.target.value
                        }}/>
                    </div>
                    <div className="pwdBox" style={styles.boxStyle}>
                        <h4 className="idLabel" style={styles.boxLabelStyle}>Password</h4>
                        <input type="password" style={styles.boxInputStyle} onKeyPress={this.onKeyPress}
                               onChange={(event) => {pwd = event.target.value}}/>
                    </div>
                </div>
                <h1 className="button" style={styles.buttonStyle} onClick={this.tryLogin}>OK</h1>
            </div>
        );
    }
}

var mapDispatchToProps = (dispatch) => {
    return ({
        loginSuccess: (id, isAdmin) => dispatch(login(id, isAdmin)),
    });
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        margin: 'auto',
        width: '350px',
        borderColor: 'white',
        borderWidth: '5px',
        borderStyle: 'solid',
        backgroundColor: 'white',
    },
    boxGroupStyle: {
        marginTop: '15px',
    },
    boxLabelStyle: {
        width: '80px',
        fontSize: '20px',
        margin: '5px',
    },
    boxInputStyle: {
        width: '200px',
        align: 'middle',
        textAlign: 'center',
    },
    boxStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '15px',
    },
    buttonStyle: {
        textAlign: 'center',
        background: 'black',
        color: 'white',
        margin: '0',
        cursor: 'pointer',
    }
};

export default withCookies(connect(undefined, mapDispatchToProps)(Login));