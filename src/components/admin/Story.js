import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_ADMIN_STORY_URL } from "../../URL";
import './Story.css';

var classTypes = new Array("전기", "후기");
var inputNum = '';
var inputClassType = classTypes[0];
var inputStoryType = 1;
var inputFile = undefined;
var REAL_API_URL = '';

class Story extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_ADMIN_STORY_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.addStory = this.addStory.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
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

    addStory(){
        var formData = new FormData();
        formData.append('num', inputNum);
        formData.append('classType', inputClassType);
        formData.append('storyType', inputStoryType);
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

    deleteStory(fileURL){
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

        header.push(<th>Num</th>);
        header.push(<th>Type</th>);
        header.push(<th>Show</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    getRow(storyData){
        const { num, storyType, fileURL } = storyData;

        return (<tr>
            <th>{ num }</th>
            <th>{ storyType }</th>
            <th style={styles.showButton}>
                <a href={ BASE_URL + fileURL } style={{textDecoration: 'none', color: 'white', width: '100%', height: '100%'}}>
                    Show
                </a>
            </th>
            <th style={styles.button} onClick={() => this.deleteStory(fileURL)}>
                Delete
            </th>
        </tr>);
    }

    getRows(storiesData){
        var rows = [];

        for (var i=0; i<storiesData.length; i++) {
            rows.push(this.getRow(storiesData[i]));
        }

        return rows;
    }

    getTable(storiesData){
        var table = [];
        var header = this.getHeader();
        var rows = this.getRows(storiesData);

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
                    var storiesData = data.stories;

                    for (var classType in classTypes){
                        var begin = cnt;
                        while (cnt < storiesData.length &&
                        storiesData[cnt].classType == classTypes[classType]){
                            ++cnt;
                        }
                        var end = cnt;

                        tables.push(
                            <div style={styles.table}>
                                { this.getTableTitle(classType) }
                                <div>{ this.getTable(storiesData.slice(begin, end)) }</div>
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
                    <input type="text" placeholder="번호" style={{width: '50px', textAlign: 'center',}}
                           onChange={(event) => {inputNum = event.target.value}}/>
                    <select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                        <option value={classTypes[0]}>전기</option>
                        <option value={classTypes[1]}>후기</option>
                    </select>
                    <select defaultValue={inputStoryType} onChange={(event) => {inputStoryType = event.target.value}}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                    <input type="file" accept=".png" style={styles.fileInput}
                           onChange={(event) => {inputFile = event.target.files[0]}}/>
                    <h3 onClick={this.addStory} style={styles.button}>+ add</h3>
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

export default withCookies(Story);