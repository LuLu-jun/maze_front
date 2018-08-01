import React, {Component} from 'react';
import image from '../image.png'

import './Story.css';


class Story extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container" style={styles.container}>
                <h1 className="title" style={styles.title}>스토리 제목!!</h1>
                <h3 className="nextButton" style={styles.nextButton}>NEXT></h3>
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
    },
    title: {
        color: 'white',
        marginTop: '0',
        marginBottom: '0',
        fontSize: '36px',
    },
    nextButton: {
        marginTop: '0',
        marginBottom: '5px',
        marginLeft: 'auto',
        fontSize: '20px',
        color: 'white',
        cursor: 'pointer',
    },
    content: {
        maxHeight: 'calc(100% - 120px)',
        marginBottom: '10px',
    },
};

export default Story;