import React, {Component} from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_STORY_URL, API_NEXT_URL } from "../URL";
import homeIcon from '../home.png'
import './Group.css';

var REAL_API_URL = '', REAL_NEXT_API_URL = '';

class Story extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_STORY_URL + "/" + cookieId + "/" + cookiePwd;
        REAL_NEXT_API_URL = API_NEXT_URL + "/" +cookieId + "/" +cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.storyNum = this.props.match.params.num;
        this.getImage = this.getImage.bind(this);
        this.moveNext = this.moveNext.bind(this);
        this.state = {
            validAccess: validAccess,
            clickNext: false,
            image: <div></div>,
        };
        if (validAccess)
            this.getImage();
    }

    getImage(){
        axios.get(REAL_API_URL + "/" + String(this.storyNum))
            .then( response => {
                var data = response.data;
                if (data.result == 0){
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else{
                    var imageURL = BASE_URL + data.imageURL;
                    this.setState({
                        validAccess: true,
                        image: <img className="content" src={imageURL} style={styles.content}/>
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

    moveNext(){
        axios.post(REAL_NEXT_API_URL, {
            type: 'story',
            number: Number(this.storyNum)
        })
            .then( response => {
                var data = response.data;
                if (data.result == 0){
                    alert(data.error);
                }
                else{
                    this.setState({
                        clickNext: true
                    });
                }
            })
            .catch( response => {
                alert(response);
            });
    }

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to='/' />
            );
        }
        if (this.state.clickNext){
            return (
                <Redirect to={'/problem/' + String(this.storyNum)} />
            );
        }
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
        justifyContent: 'center',
        width: '90%',
    },
    mainIcon: {
        height: 'calc(100% - 4px)',
        cursor: 'pointer',
    },
    nextButton: {
        fontSize: '32px',
        color: 'white',
        cursor: 'pointer',
        margin: '0',
    },
    content: {
        margin: 'auto',
        width: '800px',
    },
};

export default withCookies(Story);