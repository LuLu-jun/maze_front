import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { logout } from '../redux/actions'
import './Home.css'

function recentPageLink(recentPage){
    const { type, number } = recentPage;
    return String(type) + "/" + String(number);
}

function prevPageList(recentPage) {
    const { type, number } = recentPage;
    var array = [];

    for (var i = 1; i < number; i++){
        array.push(
            <div style={styles.box}>
                <Link to={"/story/" + String(i)}>
                    <h2 style={styles.text}>Story {i}</h2>
                </Link>
            </div>
        );
        array.push(
            <div style={styles.box}>
                <Link to={"/problem/" + String(i)}>
                    <h2 style={styles.text}>Problem {i}</h2>
                </Link>
            </div>
        );
    }
    if (String(type) === "problem"){
        array.push(
            <div style={styles.lastBox}>
                <Link to={"/story/" + String(number)}>
                    <h2 style={styles.text}>Story {number}</h2>
                </Link>
            </div>
        );
    }

    return array;
}

class Home extends Component {
    constructor(props) {
        super(props);

        this.valid = this.valid.bind(this);
        this.logout = this.logout.bind(this);
        this.recentPage = {type : "problem", number : 6};
        this.state = {
            validAccess: true,
        };
    }

    valid(){
        const id = this.props.id;
        const isAdmin = this.props.isAdmin;

        return (id!='' && !isAdmin);
    }

    logout(){
        this.props.cookies.remove('id', {path: '/'});
        this.props.cookies.remove('pwd', {path: '/'});
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
                <h1 style={{marginBottom: '0px'}}>Hello, labyrinth ({this.props.userId})!!</h1>
                <p style={styles.logout} onClick={this.logout}>Log out</p>
                <Link to={recentPageLink(this.recentPage)}><h2 style={styles.text}>Go To Recent Page</h2></Link>
                <h2 style={{marginTop: '50px', }}>Previous Page List</h2>
                <div className="pageList" style={styles.pageList}>
                    { prevPageList(this.recentPage) }
                </div>
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
    pageList: {
        width: '300px',
    },
    box: {
        display: 'inline-block',
        width: '150px',
    },
    lastBox: {
        width: '150px',
    },
    text: {
        textDecoration: 'underline',
        cursor: 'pointer',
        margin: '0',
    },
};

var mapStateToProps = (state) => {
    return ({
        id: state.login.id,
        isAdmin: state.login.isAdmin,
    });
}

var mapDispatchToProps = (dispatch) => {
    return ({
        logout: () => dispatch(logout()),
    });
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Home));