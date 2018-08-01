import React, {Component} from 'react';

import './Login.css';

var id = ''
var pwd = ''

class Login extends Component {
    constructor(props) {
        super(props);
    }

    tryLogin() {
        console.log(id)
        console.log(pwd)
    }

    render() {
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
                        <input type="password" style={styles.boxInputStyle} onChange={(event) => {
                            pwd = event.target.value
                        }}/>
                    </div>
                </div>
                <h1 className="button" style={styles.buttonStyle} onClick={this.tryLogin}>OK</h1>
            </div>
        );
    }
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

export default Login;