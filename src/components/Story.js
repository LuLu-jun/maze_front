import React, {Component} from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_STORY_URL, API_NEXT_URL,API_TIME_URL } from "../URL";
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
        this.timeRefresh = undefined;
        this.pathName = window.location.pathname;
        this.state = {
            validAccess: validAccess,
            nextPage: undefined,
            image: <div></div>,
            okayToPass: false,
            beginTime: undefined,
            endTime: undefined,
            time: ''
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
                        image: <img className="content" src={imageURL} style={styles.content}/>,
                        beginTime: data.begin,
                        endTime: data.end,
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
                        nextPage: data.nextPage
                    });
                }
            })
            .catch( response => {
                alert(response);
            });
    }

    componentDidMount() {
        this.timeRefresh = setInterval(function () {
            axios.get(API_TIME_URL)
                .then(response => {
                    if (this.pathName != window.location.pathname) { clearInterval(this.timeRefresh);}
                    if (this.state.beginTime != undefined) {
                        if (this.state.endTime != undefined) {
                            var timeDiff = 30;
                            clearInterval(this.timeRefresh);
                        }
                        else {
                            var timeDiff = Math.ceil((response.data.time - this.state.beginTime) / 1000);
                        }

                        timeDiff = 30 - timeDiff;

                        if (timeDiff <= 0) {
                            this.setState({time: '', okayToPass: true});
                            return;
                        }

                        var minutes = Math.floor((timeDiff % 3600) / 60);
                        var seconds = timeDiff % 60;

                        if (minutes < 10) {
                            minutes = "0" + String(minutes);
                        }
                        if (seconds < 10) {
                            seconds = "0" + String(seconds);
                        }

                        this.setState({
                            time: String(minutes) + ":" + String(seconds)
                        });
                    }
                });
        }.bind(this), 1000);
    }

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to='/' />
            );
        }
        if (this.state.nextPage != undefined){
            const type = this.state.nextPage.type;
            const number = this.state.nextPage.number;

            var nextPage = '/' + type;
            if (number != undefined) { nextPage = nextPage + '/' + String(number); }

            return (
                <Redirect to={nextPage}/>
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
                    <span><div className="center">
                        <h2 className="time" style={styles.time}>{this.state.time}</h2>
                    </div></span>
                    <span><div className="right">
                        <h3 className={
                          "nextButton"
                          + ((this.state.okayToPass && ' available') || '') //okayToPass가 true면 available class가 붙음
                        } onClick={() => {
                            if(this.state.okayToPass){
                              this.moveNext()
                            }else{
                                alert('이 스토리를 넘어가기 위한 최소 시간이 아직 지나지 않았습니다.')
                            }
                          }
                        } style={styles.nextButton}>NEXT></h3>
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
