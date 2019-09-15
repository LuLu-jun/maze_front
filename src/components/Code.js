import React, {Component} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {withCookies} from 'react-cookie';

import okIcon from '../ok.png'
import homeIcon from '../home.png'

import codeImage from '../code.png'

class Code extends Component {
    constructor(props, match) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        //REAL_API_URL = API_PROBLEM_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') {
            validAccess = false;
        }

        this.state = {
            image: <div>
                <img src={codeImage}></img>
            </div>
        };
    }

    render(){/*
        if(!this.StaticRange.validAccess) {
            return (
                <Redirect to='/'/>
            );
        }*/

        return (
            <div className="container" style={styles.container}>
                <div className="group">
                    <span><div className="left">
                        <Link to="/" style={{width: '0',}}>
                            <img className="mainIcon" src={homeIcon} style={styles.mainIcon}/>
                        </Link>
                    </div></span>
                    <span><div className="center"></div></span>
                    <span><div className="right">
                        <h3 className="nextButton" onClick={this.moveNext} style={styles.nextButton}>NEXT></h3>
                    </div></span>
                </div>
                { this.state.image }
            </div>
        );
    }

}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
    },
    mainIcon: {
        height: 'calc(100% - 4px)',
        cursor: 'pointer',
    },
    time: {
        color: 'white',
        fontSize: '40px',
        margin: '0',
        alignSelf: 'center',
    },
    answerBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: 'black',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: '2px',
        padding: '0px',
        width: '250px',
    },
    answerInput: {
        padding: '0',
        margin: '0',
        marginLeft: '4px',
        align: 'middle',
        textAlign: 'center',
        border: '0px',
        outline: 'none',
        background: 'black',
        color: 'white',
        height: 'calc(100% - 2px)',
        flex: 1,
    },
    answerButton: {
        height: '32px',
        margin: '4px',
        cursor: 'pointer',
    },
    hintGroup: {
        margin: 'auto',
    },
    hint: {
        color: 'white',
        margin: '4px',
        textAlign: 'start',
        textDecoration: 'underline',
    },
    content: {
        margin: 'auto',
        width: '1000px',
    },
};

export default withCookies(Code);
