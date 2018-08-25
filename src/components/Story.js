import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import image from '../image.png'
import storyImage from '../story.png'
import homeIcon from '../home.png'

import './Group.css';


class Story extends Component {
    constructor(props) {
        super(props);

        this.storyNum = this.props.match.params.num;
        this.valid = this.valid.bind(this);
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && !isAdmin);
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to='/' />
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
                        <Link to={"/problem/" + String(this.storyNum)} style={{textDecoration: 'none',}}>
                            <h3 className="nextButton" style={styles.nextButton}>NEXT></h3>
                        </Link>
                    </div></span>
                </div>
                <img className="content" src={storyImage} style={styles.content}/>
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

var mapStateToProps = (state) => {
    return ({
        userId: state.login.userId,
        isAdmin: state.login.isAdmin,
    });
}

export default connect(mapStateToProps)(Story);