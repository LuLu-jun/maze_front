import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { logout } from '../../redux/actions';

class Home extends Component {
    constructor(props) {
        super(props);

        this.valid = this.valid.bind(this);
        this.logout = this.logout.bind(this);
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && isAdmin);
    }

    logout(){
        this.props.cookies.remove('userId', {path: '/'});
        this.props.cookies.remove('isAdmin', {path: '/'});
        this.props.logout();
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <div className="box" style={styles.box}>
                    <h1 style={styles.text}>about</h1>
                    <div className="buttons" style={styles.buttons}>
                        <h1 style={styles.button} onClick={this.logout}>Log out</h1>
                        <Link to="/admin/member" style={{textDecoration: 'none',}}>
                            <h1 style={styles.button}>Members</h1>
                        </Link>
                        <h1 style={styles.button}>Problems</h1>
                        <Link to="/admin/class" style={{textDecoration: 'none',}}>
                            <h1 style={styles.button}>Classes</h1>
                        </Link>
                    </div>
                </div>
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
        logout: () => dispatch(logout()),
    });
}

const styles = {
    container: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        margin: '0',
    },
    buttons: {
        marginLeft: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
    },
    button: {
        color: 'white',
        fontSize: '48px',
        marginTop: '4px',
        marginBottom: '4px',
        cursor: 'pointer',
    },
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Home));