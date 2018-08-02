import React, {Component} from 'react';
import image from '../image.png'
import homeIcon from '../home.png'

import './Group.css';


class Story extends Component {
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
                    <span><div class="center"></div></span>
                    <span><div class="right">
                        <h3 className="nextButton" style={styles.nextButton}>NEXT></h3>
                    </div></span>
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
        width: '500px',
    },
};

export default Story;