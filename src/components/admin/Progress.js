import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { API_ADMIN_PROGRESS_URL } from "../../URL";
import yellowCard from '../../yellowCard.png';
import './Progress.css';

var REAL_API_URL = '';

class Progress extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_ADMIN_PROGRESS_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.getHeader = this.getHeader.bind(this);
        this.getTime = this.getTime.bind(this);
        this.getProgress = this.getProgress.bind(this);
        this.getYellowCard = this.getYellowCard.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getRows = this.getRows.bind(this);
        this.getTable = this.getTable.bind(this);
        this.state={
            validAccess: validAccess,
            table: '',
        };
        if (validAccess)
            this.getTable();
    }

    getHeader(problemNum){
        var header = [];

        header.push(<th>Class</th>);
        for (var i=1; i<=problemNum; i++){
            header.push(<th>{"Problem " + String(i)}</th>);
        }
        header.push(<th>Yellow card</th>);

        return (<tr>{header}</tr>);
    }

    getTime(begin, end){
        if (begin == -1){
            return '00:00:00';
        }
        if (end == -1){
            return '??:??:??';
        }
        return end;
    }

    getProgress(progress){
        var progressArray = [];

        for (var i=0; i<9; i++){
            const {begin, end} = progress[i];
            progressArray.push(<th>{ this.getTime (begin, end) }</th>);
        }

        return progressArray;
    }

    getYellowCard(num){
        var cards = [];
        for (var i=0; i<num; i++){
            cards.push(<img src={yellowCard} style={{width: '12px'}} />);
        }
        return (<div style={styles.cards}>{cards}</div>);
    }

    getRow(progressData){
        const { classNum, progress, warningNum } = progressData;

        return (<tr>
            <th>{ classNum }</th>
            { this.getProgress(progress) }
            <th>{ this.getYellowCard(warningNum) }</th>
        </tr>);
    }

    getRows(progressesData){
        var rows = [];

        for (var i=0; i<progressesData.length; i++){
            rows.push(this.getRow(progressesData[i]));
        }

        return rows;
    }

    getTable(){
        var table = [];

        axios.get(REAL_API_URL)
            .then( response => {
                const data = response.data;

                if (data.result == 0) {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else {
                    var header = this.getHeader(9);
                    var datas = this.getRows(data.progresses);

                    table.push(header);
                    table.push(datas);

                    this.setState({
                        validAccess: true,
                        table: table,
                    });
                }
            })

        return table;
    }

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <table>{this.state.table}</table>
            </div>
        );
    }
}

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '30px',
        height: '20px',
        margin : 'auto',
    },
};

export default withCookies(Progress);