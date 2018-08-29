import React, {Component} from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { withCookies } from 'react-cookie';

import { API_MEMBER_URL } from "../../URL"
import './Member.css'

var classNum='';
var id='';
var pwd='';
var classTypes = new Array("전기", "후기");
var classType = classTypes[0];
var problemTypes='';
var hintCodes = new Array("", "", "");
var REAL_API_URL = '';

class Member extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_MEMBER_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getHintCodes = this.getHintCodes.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getRows = this.getRows.bind(this);
        this.getTable = this.getTable.bind(this);
        this.state={
            validAccess: validAccess,
            table: '',
        }
        if (validAccess)
            this.getTable();
    }

    addMember(){
        axios.post(REAL_API_URL, {
            classNum: classNum,
            id: id,
            pwd: pwd,
            classType: classType,
            problemType: problemTypes,
            hintCodes: hintCodes,
        })
            .then( response => {
                var data = response.data;
                if (data.result == 1) { this.getTable(); }
                else {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
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

    deleteMember(classNum){
        axios.delete(REAL_API_URL + "/" + String(classNum))
            .then( response => {
                var data = response.data;
                if (data.result == 1) { this.getTable(); }
                else {
                    alert(data.error);
                    this.setState({
                        validAccess: false
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

    getHeader(){
        var header = [];

        header.push(<th>Class</th>);
        header.push(<th>ID</th>);
        header.push(<th>Password</th>);
        header.push(<th>Class Type</th>);
        header.push(<th>Problem Type</th>);
        header.push(<th>Hint codes</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    getHintCodes(hintCodes){
        var result = [];

        for (var i=0; i<hintCodes.length;i ++){
            result.push(<p style={{margin: '0'}}>{hintCodes[i]}</p>);
        }
        return (<div style={{display: 'flex', flexDirection: 'column'}}>{result}</div>);
    }

    getRow(memberData){
        const { classNum, id, pwd, classType, problemType, hintCodes } = memberData;

        return (<tr>
            <th>{ classNum }</th>
            <th>{ id }</th>
            <th>{ pwd }</th>
            <th>{ classType }</th>
            <th>{ problemType }</th>
            <th>{ this.getHintCodes(hintCodes) }</th>
            <th style={styles.button} onClick={() => this.deleteMember(classNum)}>
                Delete
            </th>
        </tr>);
    }

    getRows(membersData){
        var rows = [];

        for (var i=0; i<membersData.length; i++) {
            rows.push(this.getRow(membersData[i]));
        }

        return rows;
    }

    getTable(){
        var table = [];
        var header = this.getHeader();

        axios.get(REAL_API_URL)
            .then( response => {
                var data = response.data;
                if (data.result == 0) {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else {
                    var membersData = response.data.members;
                    var elements = this.getRows(membersData);
                    table.push(header);
                    table.push(elements);
                    this.setState({
                        table: table,
                        validAccess: true,
                    });
                }
            })
            .catch( response => {
                alert(response);
                this.setState({
                    table: table,
                    validAccess: false,
                });
            } );
    }

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <div className="box" style={styles.box}>
                    <div style={styles.inputs}>
                        <div style={styles.inputLine}>
                            <input type="text" style={styles.boxInputStyle} placeholder="class number"
                                   onChange={(event) => {classNum = Number(event.target.value)}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="id"
                                   onChange={(event) => {id = event.target.value}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="pwd"
                                   onChange={(event) => {pwd = event.target.value}}/>
                            <select defaultValue={classType} onChange={(event) => {classType = event.target.value}}>
                                <option value={classTypes[0]}>전기</option>
                                <option value={classTypes[1]}>후기</option>
                            </select>
                            <input type="text" style={styles.boxInputStyle} placeholder="problem types (가 or 나)"
                                   onChange={(event) => {problemTypes = event.target.value}}/>
                        </div>
                        <div stlye={styles.inputLine}>
                            <input type="text" style={styles.boxInputStyle} placeholder="hint code 1"
                                   onChange={(event) => {hintCodes[0] = event.target.value}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="hint code 2"
                                   onChange={(event) => {hintCodes[1] = event.target.value}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="hint code 3"
                                   onChange={(event) => {hintCodes[2] = event.target.value}}/>
                        </div>
                    </div>
                    <h3 onClick={this.addMember} style={styles.button}>+ add</h3>
                </div>
                <table>{this.state.table}</table>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        display: 'flex',
        flexDirection :'row',
        alignItems: 'center',
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    inputLine: {
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default withCookies(Member);