import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_ADMIN_BRANCH_URL } from "../../URL";
import './Branch.css';

var classTypes = new Array("전기", "후기");
var inputClassType = classTypes[0];
var inputBeforeStory = '';
var inputYesStory = '';
var inputNoStory = '';
var inputFile = undefined;
var REAL_API_URL = '';

class Branch extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_ADMIN_BRANCH_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.addBranch = this.addBranch.bind(this);
        this.deleteBranch = this.deleteBranch.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getRows = this.getRows.bind(this);
        this.getTable = this.getTable.bind(this);
        this.getTableTitle = this.getTableTitle.bind(this);
        this.getTables = this.getTables.bind(this);
        this.state={
            validAccess: validAccess,
            tables: '',
        }
        if (validAccess)
            this.getTables();
    }

    addBranch(){
        var formData = new FormData();
        formData.append('classType', inputClassType);
        formData.append('beforeStory', inputBeforeStory);
        formData.append('yesStory', inputYesStory);
        formData.append('noStory', inputNoStory);
        formData.append('file', inputFile);

        axios.post(REAL_API_URL, formData)
            .then( response => {
                var data = response.data;
                if (data.result == 0) {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else { this.getTables(); }
            })
            .catch( response => { alert(response) } );
    }

    deleteBranch(fileURL){
        const array = fileURL.split("/");
        const fileName = array[array.length - 1];

        axios.delete(REAL_API_URL + "/" + fileName)
            .then( response => {
                var data = response.data;
                if (data.result == 0) {
                    alert(data.error);
                    this.setState({
                        validAccess: false,
                    });
                }
                else { this.getTables(); }
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

        header.push(<th>beforeStory</th>);
        header.push(<th>yesStory</th>);
        header.push(<th>noStory</th>);
        header.push(<th>Show</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    getRow(branchData){
        const { beforeStory, yesStory, noStory, fileURL } = branchData;

        return (<tr>
            <th>{ beforeStory }</th>
            <th>{ yesStory }</th>
            <th>{ noStory }</th>
            <th style={styles.showButton}>
                <a href={ BASE_URL + fileURL } style={{textDecoration: 'none', color: 'white', width: '100%', height: '100%'}}>
                    Show
                </a>
            </th>
            <th style={styles.button} onClick={() => this.deleteBranch(fileURL)}>
                Delete
            </th>
        </tr>);
    }

    getRows(branchesData){
        var rows = [];

        for (var i=0; i<branchesData.length; i++) {
            rows.push(this.getRow(branchesData[i]));
        }

        return rows;
    }

    getTable(branchesData){
        var table = [];
        var header = this.getHeader();
        var rows = this.getRows(branchesData);

        table.push(header);
        table.push(rows);

        return table;
    }

    getTableTitle(classType){
        return (
            <h2 style={styles.tableTitle}>{classTypes[classType]}</h2>
        );
    }

    getTables(){
        var tables = [];

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
                    var cnt = 0;
                    var branchesData = data.branches;

                    for (var classType in classTypes){
                        var begin = cnt;
                        while (cnt < branchesData.length &&
                        branchesData[cnt].classType == classTypes[classType]){
                            ++cnt;
                        }
                        var end = cnt;

                        tables.push(
                            <div style={styles.table}>
                                { this.getTableTitle(classType) }
                                <div>{ this.getTable(branchesData.slice(begin, end)) }</div>
                            </div>
                        );
                    }

                    this.setState({
                        tables: tables,
                        validAccess: true,
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

    render() {
        if (!this.state.validAccess){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <div className="box" style={styles.box}>
                    <select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                        <option value={classTypes[0]}>전기</option>
                        <option value={classTypes[1]}>후기</option>
                    </select>
                    <input type="text" placeholder="이전 스토리" style={{width: '100px', textAlign: 'center',}}
                           onChange={(event) => {inputBeforeStory = event.target.value}}/>
                    <input type="text" placeholder="Yes 이후 스토리" style={{width: '120px', textAlign: 'center',}}
                           onChange={(event) => {inputYesStory = event.target.value}}/>
                    <input type="text" placeholder="No 이후 스토리" style={{width: '120px', textAlign: 'center',}}
                           onChange={(event) => {inputNoStory = event.target.value}}/>
                    <input type="file" accept=".png, .gif" style={styles.fileInput}
                           onChange={(event) => {inputFile = event.target.files[0]}}/>
                    <h3 onClick={this.addBranch} style={styles.button}>+ add</h3>
                </div>
                <div style={styles.tables}>
                    {this.state.tables}
                </div>
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
    tables:{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '50px',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        marginLeft: '20px',
        marginRight: '20px',
        marginTop: '20px',
    },
    box: {
        display: 'flex',
        flexDirection :'row',
        height: '40px',
        alignItems: 'center',
    },
    fileInput: {
        color: 'white',
    },
    tableTitle: {
        color: 'white',
        margin: '0',
        marginBottom: '5px',
    },
    button: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    showButton: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default withCookies(Branch);