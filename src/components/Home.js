import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { logout } from '../redux/actions'
import './Home.css'

function prevProblemList(curProblem) {
    var array = [];
    for (var i = 0; i < curProblem - 1; i++){
        array.push(
            <Link to={"/problem/" + String(i + 1)}>
                <h2 style={styles.text}>Go To {i + 1}</h2>
            </Link>
        );
    }
    return array;
}

class Home extends Component {
    constructor(props) {
        super(props);

        this.valid = this.valid.bind(this);
        this.logout = this.logout.bind(this);
        this.curProblemLink = this.curProblemLink.bind(this);
        this.curProblem = 6;
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && !isAdmin);
    }

    logout(){
        this.props.cookies.remove('userId', {path: '/'});
        this.props.cookies.remove('isAdmin', {path: '/'});
        this.props.logout();
    }

    curProblemLink(){
        return "/problem/" + String(this.curProblem);
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <h1 style={{marginBottom: '0px'}}>Hello, labyrinth ({this.props.userId})!!</h1>
                <p style={styles.logout} onClick={this.logout}>Log out</p>
                <Link to={this.curProblemLink()}><h2 style={styles.text}>Go To Current Problem</h2></Link>
                <h2 style={{marginTop: '50px', }}>Previous Problem List</h2>
                { prevProblemList(this.curProblem) }
            </div>
        );
    }
}

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logout: {
        cursor: 'pointer',
        margin: '0',
        marginBottom: '40px',
        textDecoration: 'underline',
    },
    text: {
        textDecoration: 'underline',
        cursor: 'pointer',
        margin: '0',
    },
};

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

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Home));