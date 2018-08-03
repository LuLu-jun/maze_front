import React, {Component} from 'react';
import image from '../image.png'
import okIcon from '../ok.png'
import homeIcon from '../home.png'

import './Group.css';

class Problem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container" style={styles.container}>
                <div class="group">
                    <span><div class="left">
                        <img className="mainIcon" src={homeIcon} style={styles.mainIcon}/>
                    </div></span>
                    <span><div class="center">
                        <h2 className="time" style={styles.time}>11:11</h2>
                    </div></span>
                    <span><div class="right">
                        <div className="answerBox" style={styles.answerBox}>
                            <input type="text" style={styles.answerInput}/>
                            <img className="okButton" src={okIcon} style={styles.answerButton}/>
                        </div>
                    </div></span>
                </div>
                <div className="hintGroup" style={styles.hintGroup}>
                    <p style={styles.hint}>힌트1</p>
                    <p style={styles.hint}>힌트2sdfasdfdasffadsasdfzcxcx</p>
                    <p style={styles.hint}>힌트3wewwerweerw</p>
                </div>
                <img className="content" src={image} style={styles.content}/>
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
        marginBottom: '0',
    },
    hint: {
        color: 'white',
        margin: '4px',
        textAlign: 'start',
        textDecoration: 'underline',
    },
    content: {
        margin: 'auto',
        width: '500px',
    },
};

export default Problem;