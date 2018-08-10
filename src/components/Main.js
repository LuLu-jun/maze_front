import React, {Component} from 'react';
import './Main.css'

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container" style={styles.container}>
                <h1 style={{marginBottom: '80px',}}>Hello, labyrinth!!</h1>
                <h2 style={styles.text}>Go To Current Problem</h2>
                <h2 style={{marginTop: '50px', }}>Previous Problem List</h2>
                <h2 style={styles.text}>Go To 1</h2>
                <h2 style={styles.text}>Go To 2</h2>
                <h2 style={styles.text}>Go To 3</h2>
                <h2 style={styles.text}>Go To 4</h2>
                <h2 style={styles.text}>Go To 5</h2>
                <h2 style={styles.text}>Go To 6</h2>
                <h2 style={styles.text}>Go To 7</h2>
                <h2 style={styles.text}>Go To 8</h2>
            </div>
        );
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
    text: {
        textDecoration: 'underline',
        cursor: 'pointer',
        margin: '0',
    },

};

export default Main;