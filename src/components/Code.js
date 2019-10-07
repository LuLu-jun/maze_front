import React, {Component} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {withCookies} from 'react-cookie';

import {API_NEXT_URL, API_TIME_URL} from "../URL";
import okIcon from '../ok.png';
import homeIcon from '../home.png';

import codeImage from '../code.png';
import wrongImage from '../wrong.png'

var REAL_NEXT_API_URL = '';
var answer = '';

class Code extends Component {
    constructor(props, match) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_NEXT_API_URL = API_NEXT_URL + "/" + cookieId + "/" + cookiePwd;
        //API_TIME_URL

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') {
            validAccess = false;
        }
        
        this.codeNum = this.props.match.params.num;
        this.compareCode = this.compareCode.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.pathName = window.location.pathname;
        this.timeRefresh = undefined;
        this.state = {
            image: <div>
                <img src={codeImage}></img>
            </div>,
            beginTime: undefined,
            endTime: undefined,
            time: '',
            answerState: ''
        };
    }

    componentDidMount() {
        console.log("componenDidMount!");
        this.timeRefresh = setInterval(function () {
            axios.get(API_TIME_URL)
                .then(response => {
                    if (this.pathName != window.location.pathname) { clearInterval(this.timeRefresh); }
                    if (this.state.beginTime != undefined) {
                        if (this.state.endTime != undefined) {
                            var timeDiff = Math.ceil((this.state.endTime - this.state.beginTime) / 1000);
                            clearInterval(this.timeRefresh);
                        }
                        else {
                            var timeDiff = Math.ceil((response.data.time - this.state.beginTime) / 1000);
                            /*
                            if (timeDiff >= firstHintTime && this.state.hints[0] == null ||
                                timeDiff >= secondHintTime && this.state.hints[1] == null) {
                                this.getHints();
                            }*/
                        }

                        if (timeDiff < 0) {
                            this.setState({time: ''});
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

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.compareCode();
        }
    }

    compareCode() {
        axios.post(REAL_NEXT_API_URL, {
            type: 'code',
            number: Number(this.codeNum),
            answer: answer
        })
            .then(response => {
                var data = response.data;
                if (data.result == 0) {
                  switch(data.error){
                    case 'wrong code':
                      this.setState({answerState: 'wrong'})
                      setTimeout(()=>{
                        this.setState({answerState: ''})
                      }, 1000);
                      break;
                    case 'WARNING !!':
                      this.setState({answerState: 'warning'})
                      setTimeout(()=>{
                        this.setState({answerState: ''})
                      }, 2000);
                      break;
                  }
                }
                else if (data.result == 1) {
                    clearInterval(this.timeRefresh);
                    this.setState({
                        nextPage: data.nextPage
                    });
                }
                else { //data.result == -1
                    alert(data.result + 'compareAnwser(): Hint arrived !!');
                    var currentHint = this.state.hints;
                    currentHint[2] = data.hint;
                    this.setState({
                        hints: currentHint
                    });
                }
            })
            .catch(response => {
                alert(response);
            });
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
                    <span><div className="center">
                        <h2 className="time" style={styles.time}>{this.state.time}</h2>
                    </div></span>
                    <span><div className="right">
                        <div className="answerBox" style={styles.answerBox}>
                            <input type="text" style={styles.answerInput} onKeyPress={this.onKeyPress}
                                   onChange={(event) => {
                                       console.log(answer);
                                       answer = event.target.value
                                   }}/>
                            <img className="okButton" src={okIcon} onClick={this.compareAnswer}
                                 style={styles.answerButton}/>
                        </div>
                    </div></span>
                </div>
                {(this.state.answerState=='' && this.state.image)}
                {(this.state.answerState=='wrong' && <img className="content" src={wrongImage} style={styles.content}/>)}
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
