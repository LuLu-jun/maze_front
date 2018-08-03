import React, {Component} from 'react';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container" style={styles.container}>
                <div className="box" style={styles.box}>
                    <h1 style={styles.text}>about</h1>
                    <div className="links" style={styles.links}>
                        <h1 style={styles.link}>Problems</h1>
                        <h1 style={styles.link}>Classes</h1>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        margin: '0',
    },
    links: {
        marginLeft: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
    },
    link: {
        color: 'white',
        fontSize: '48px',
        marginTop: '4px',
        marginBottom: '4px',
        cursor: 'pointer',
    },
};

export default Main;