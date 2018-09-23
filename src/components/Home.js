import React, {Component} from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { API_HOME_URL } from "../URL";
import { logout } from '../redux/actions';
import './Home.css';

var REAL_API_URL = '';

function recentPageLink(recentPage){
    const { type, number } = recentPage;
    return String(type) + "/" + String(number);
}

function prevPageList(stories, problems, branches) {
    var array = [];

    var prevStories = new Array();
    for (var i=0; i<stories.length; i++){
        if (stories[i] == -1) { break; }
        array.push(
            <div style={styles.box}>
                <Link to={"/story/" + String(i + 1)}>
                    <h2 style={styles.text}>Story {i + 1}</h2>
                </Link>
            </div>
        );
    }
    for (var i=0; i<problems.length; i++){
        if (problems[i].begin == -1) { break; }
        array.push(
            <div style={styles.box}>
                <Link to={"/problem/" + String(i + 1)}>
                    <h2 style={styles.text}>Problem {i + 1}</h2>
                </Link>
            </div>
        );
    }
    for (var i=0; i<branches.length; i++){
        if (branches[i].storyNumber == -1) { break; }
        array.push(
            <div style={styles.box}>
                <Link to={"/branch/" + String(i + 1)}>
                    <h2 style={styles.text}>Branch {i + 1}</h2>
                </Link>
            </div>
        );
    }
    return array;
}

class Home extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_HOME_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.logout = this.logout.bind(this);
        this.getData = this.getData.bind(this);
        this.isStart = this.isStart.bind(this);
        this.state = {
            validAccess: validAccess,
            data: undefined,
        };
        if (validAccess)
            this.getData();
    }

    logout(){
        this.props.cookies.remove('id', {path: '/'});
        this.props.cookies.remove('pwd', {path: '/'});
        this.props.logout();
        this.setState({
            validAccess: false,
            data: undefined,
        });
    }

    getData(){
        axios.get(REAL_API_URL)
            .then( response => {
                var data = response.data;
                if (data.result == 0){
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else{
                    var progress = data.progress;
                    this.setState({
                        validAccess: true,
                        data: {
                            classNum: progress.classNum,
                            recentPage: progress.recentPage,
                            stories: progress.stories,
                            problems: progress.problems,
                            branches: progress.branches,
                        }
                    });
                }
            })
            .catch( response => {
                alert(response);
                this.setState({
                    validAccess: false,
                });
            });
    }

    isStart(recentPage){
        if (recentPage.type == "story" && recentPage.number == 1){
            return true;
        }
        return false;
    }

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to="/" />
            );
        }

        if (this.state.data != undefined) {
            if (this.isStart(this.state.data.recentPage)){
                return (
                    <Redirect to="/story/1" />
                );
            }
            return (
                <div className="container" style={styles.container}>
                    <h1 style={{marginBottom: '0px'}}>Hello, Class {this.state.data.classNum}!!</h1>
                    <p style={styles.logout} onClick={this.logout}>Log out</p>
                    <Link to={recentPageLink(this.state.data.recentPage)}><h2 style={styles.text}>Go To Recent Page</h2>
                    </Link>
                    <h2 style={{marginTop: '50px',}}>Previous Page List</h2>
                    <div className="pageList" style={styles.pageList}>
                        {prevPageList(this.state.data.stories, this.state.data.problems, this.state.data.branches)}
                    </div>
                </div>
            );
        }
        else { return (<div></div>); }
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

var mapDispatchToProps = (dispatch) => {
    return ({
        logout: () => dispatch(logout()),
    });
};

export default withCookies(connect(undefined, mapDispatchToProps)(Home));