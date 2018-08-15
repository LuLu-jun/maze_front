import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { login, adminLogin } from '../redux/actions'
import './Login.css';

var id = ''
var pwd = ''

class Login extends Component {
    constructor(props) {
        super(props);

        this.state={
            redirect: false,
        };
        this.onKeyPress = this.onKeyPress.bind(this);
        this.tryLogin = this.tryLogin.bind(this);
        this.loginWithCookie = this.loginWithCookie.bind(this);
    }

    onKeyPress(event){
        if (event.key === 'Enter'){
            this.tryLogin();
        }
    }

    tryLogin() {
        if (id == '') { return; }

        if (id === "admin") {
            this.props.adminLoginSuccess(id);
            this.props.cookies.set('isAdmin', true, {path: '/login'});
        }
        else {
            this.props.loginSuccess(id);
            this.props.cookies.set('isAdmin', false, {path: '/login'});
        }
        this.props.cookies.set('userId', id, {path: '/'});
        id = this.props.cookies.get('userId') || '';

        this.setState({
            redirect: true,
        });
    }

    loginWithCookie() {
        id = this.props.cookies.get('userId') || '';
        this.tryLogin();
    }

    render() {
        if (this.state.redirect){
            return (
                <Redirect to="/" />
            );
        }
        this.loginWithCookie();

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

var mapStateToProps = (state) => {
    return ({
        userId: state.login.userId,
        isAdmin: state.login.isAdmin,
    });
}

var mapDispatchToProps = (dispatch) => {
    return ({
        loginSuccess: (userId) => dispatch(login(userId)),
        adminLoginSuccess: (userId) => dispatch(adminLogin(userId)),
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

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Login));