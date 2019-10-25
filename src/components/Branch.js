import React, {Component} from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_BRANCH_URL, API_NEXT_URL } from "../URL";
import homeIcon from '../home.png'
import './Group.css';

var REAL_API_URL = '', REAL_NEXT_API_URL = '';

class Branch extends Component{
    constructor(props){
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_BRANCH_URL + "/" + cookieId + "/" + cookiePwd;
        REAL_NEXT_API_URL = API_NEXT_URL + "/" +cookieId + "/" +cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.branchNum = this.props.match.params.num;
        this.getImage = this.getImage.bind(this);
        this.click = this.click.bind(this);
        this.state = {
            validAccess: validAccess,
            nextPage: undefined,
            image: <div></div>,
        };

        if (validAccess)
            this.getImage();
    }

    getImage(){
        axios.get(REAL_API_URL + "/" + String(this.branchNum))
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
                        image:
                          imageURL.match(/\.(jpeg|jpg|gif|png)$/) != null ?
                          <img className="content" src={imageURL} style={styles.content} /> :
                          <video className="content" src={imageURL} style={styles.content} autoPlay controls/>
                        ,
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

    click(decision){
        axios.post(REAL_NEXT_API_URL, {
            type: 'branch',
            number: Number(this.branchNum),
            decision: decision
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

    render(){
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
                    <span><div className="center"></div></span>
                    <span><div className="right"></div></span>
                </div>
                { this.state.image }
                <div className="choiceGroup" style={styles.choiceGroup}>
                    <h1 style={styles.choice} onClick={() => this.click("yes")}>Yes</h1>
                    <h1 style={styles.choice} onClick={() => this.click("no")}>No</h1>
                </div>
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
    content: {
        margin: 'auto',
        width: '500px',
    },
    choiceGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 'auto',
        width: '500px',
    },
    choice: {
        cursor: 'pointer',
    }
};

export default withCookies(Branch);
