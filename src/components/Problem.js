import React, {Component} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {withCookies} from 'react-cookie';

import {BASE_URL, API_PROBLEM_URL, API_NEXT_URL, API_TIME_URL} from "../URL";
import okIcon from '../ok.png'
import homeIcon from '../home.png'
import './Group.css';

import warningImage from '../warning.png'
import wrongImage from '../wrong.png'

var REAL_API_URL = '', REAL_NEXT_API_URL = '', REAL_HINT_API_URL = '';
var answer = '';
const hintInterval = 5*60;

class Problem extends Component {
    constructor(props, match) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_PROBLEM_URL + "/" + cookieId + "/" + cookiePwd;
        REAL_NEXT_API_URL = API_NEXT_URL + "/" + cookieId + "/" + cookiePwd;
        REAL_HINT_API_URL = API_NEXT_URL + "/hint/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') {
            validAccess = false;
        }

        this.problemNum = this.props.match.params.num;
        this.getImage = this.getImage.bind(this);
        this.compareAnswer = this.compareAnswer.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.showHints = this.showHints.bind(this);
        this.getHints = this.getHints.bind(this);
        this.timeRefresh = undefined;
        this.pathName = window.location.pathname;
        this.state = {
            validAccess: validAccess,
            nextPage: undefined,
            image: <div></div>,
            beginTime: undefined,
            endTime: undefined,
            time: '',
            hints: [],
            answerState: ''
        };
        this.timeDiff = 0;
        if (validAccess) {
            this.getImage();
            this.getHints();
        }
    }

    componentDidMount() {
        this.timeRefresh = setInterval(function () {
            axios.get(API_TIME_URL)
                .then(response => {
                    if (this.pathName != window.location.pathname) { clearInterval(this.timeRefresh); }
                    if (this.state.beginTime != undefined) {
                        if (this.state.endTime != undefined) {
                            this.timeDiff = Math.ceil((response.data.time - this.state.beginTime) / 1000);
                            clearInterval(this.timeRefresh);
                        }
                        else {
                            this.timeDiff = Math.ceil((response.data.time - this.state.beginTime) / 1000);
                        }

                        if (this.timeDiff < 0) {
                            this.setState({time: ''});
                            this.timeRefresh = null;
                            return;
                        }

                        var minutes = Math.floor((this.timeDiff % 3600) / 60);
                        var seconds = this.timeDiff % 60;

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

    getImage() {
        axios.get(REAL_API_URL + "/" + String(this.problemNum))
            .then(response => {
                var data = response.data;
                if (data.result == 0) {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else {
                    var imageURL = BASE_URL + data.imageURL;
                    this.setState({
                        validAccess: true,
                        image:
                          imageURL.match(/\.(jpeg|jpg|gif|png)$/) != null ?
                          <img className="content" src={imageURL} style={styles.content} /> :
                          <video className="content" src={imageURL} style={styles.content} autoPlay controls/>
                        ,
                        beginTime: data.begin,
                        endTime: data.end,
                    });
                }
            })
            .catch(response => {
                alert(response);
                this.setState({
                    validAccess: false,
                });
            });
    }

    compareAnswer() {
        axios.post(REAL_NEXT_API_URL, {
            type: 'problem',
            number: Number(this.problemNum),
            answer: answer
        })
            .then(response => {
                var data = response.data;
                if (data.result == 0) {
                  switch(data.error){
                    case 'wrong answer':
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
                else {
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

    getHints() {
        axios.get(REAL_HINT_API_URL + "/" + this.problemNum)
            .then(response => {
                var data = response.data;
                if (data.result == 0) {
                  alert("Error occured. Please refresh\n---------\n"+data.error);
                }
                else {
                    this.setState({
                        hints: data.hints
                    });
                }
            })
            .catch(response => {
                alert(response);
            });
    }

    showHints(hints, timeDiff) {
        return (
          <div className="hintGroup" style={styles.hintGroup}>
            <p> Hints </p>
            {
              hints.map((hint, i)=>{
                if(timeDiff < (i+1)*hintInterval) {
                  return;
                }
                return (
                  <p style={styles.hint} key={"hint_"+i}>
                    {hint}
                  </p>
                );
              })
            }
          </div>
        )
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.compareAnswer();
        }
    }

    render() {
        if (!this.state.validAccess) {
            return (
                <Redirect to='/'/>
            );
        }
        if (this.state.nextPage != undefined) {
            const type = this.state.nextPage.type;
            const number = this.state.nextPage.number;
            const nextPage = '/' + type + '/' + String(number);

            if (type == "problem") { window.location.reload(); }

            return (
                <Redirect to={nextPage}/>
            );
        }
        return (
            <div className="container" style={styles.container}>
                <div className="group">
                    <span><div className="left">
                        <Link to="/" onClick={()=>{ clearInterval(this.timeRefresh); }} style={{width: '0',}}>
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
                                       answer = event.target.value
                                   }}/>
                            <img className="okButton" src={okIcon} onClick={this.compareAnswer}
                                 style={styles.answerButton}/>
                        </div>
                    </div></span>
                </div>
                {(this.state.answerState=='' && this.state.image)}
                {(this.state.answerState=='wrong' && <img className="content" src={wrongImage} style={styles.content}/>)}
                {(this.state.answerState=='warning' && <img className="content" src={warningImage} style={styles.content}/>)}
                  {this.showHints(this.state.hints, this.timeDiff)}
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

export default withCookies(Problem);
