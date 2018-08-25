import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import image from '../image.png'
import problemImage from '../problem.png'
import okIcon from '../ok.png'
import homeIcon from '../home.png'

import './Group.css';

var answer='';

class Problem extends Component {
    constructor(props, match) {
        super(props);

        this.state={
            correct: false,
        };
        this.problemNum = this.props.match.params.num;
        this.valid = this.valid.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && !isAdmin);
    }

    onKeyPress(event){
        if (event.key === 'Enter'){
            this.setState({
                correct: true,
            });
        }
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to='/' />
            );
        }
        if (this.state.correct){
            return (
                <Redirect to={'/story/' + String(parseInt(this.problemNum) + 1)}/>
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
                        <h2 className="time" style={styles.time}>11:11</h2>
                    </div></span>
                    <span><div className="right">
                        <div className="answerBox" style={styles.answerBox}>
                            <input type="text" style={styles.answerInput} onKeyPress={this.onKeyPress}
                                   onChange={(event) => {answer= event.target.value}} />
                            <img className="okButton" src={okIcon} style={styles.answerButton}/>
                        </div>
                    </div></span>
                </div>
                <img className="content" src={problemImage} style={styles.content}/>
                <div className="hintGroup" style={styles.hintGroup}>
                    <p style={styles.hint}>힌트1</p>
                    <p style={styles.hint}>힌트2sdfasdfdasffadsasdfzcxcx</p>
                    <p style={styles.hint}>힌트3wewwerweerw</p>
                </div>
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

var mapStateToProps = (state) => {
    return ({
        userId: state.login.userId,
        isAdmin: state.login.isAdmin,
    });
}

export default connect(mapStateToProps)(Problem);