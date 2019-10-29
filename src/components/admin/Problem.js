import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_ADMIN_PROBLEM_URL } from "../../URL";
import './Problem.css';

var classTypes = new Array('전기');//new Array("전기", "후기"); 2019: 전기 only
var problemTypes = new Array("A", "B", "C");
var inputNum = '';
var inputClassType = classTypes[0];
var inputProblemType = problemTypes[0];
var inputFile = undefined;
var inputAnswer = "";
var inputHints = [];
var REAL_API_URL = '';

class Problem extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_ADMIN_PROBLEM_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.addProblem = this.addProblem.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getHints = this.getHints.bind(this);
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

    addProblem(){
        var formData = new FormData();
        formData.append('num', inputNum);
        formData.append('answer', inputAnswer);
        formData.append('classType', inputClassType);
        formData.append('problemType', inputProblemType);
        formData.append('hints', inputHints);
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
            .catch( response => {
                alert(response);
                this.setState({
                    validAccess: false,
                });
            });
    }

    deleteProblem(fileURL){
        const array = fileURL.split("/");
        const fileName = array[array.length - 1];
;
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
        header.push(<th>Show</th>);
        header.push(<th>Answer</th>);
        header.push(<th>Hints</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    getHints(hints){
        var result = [];

        for (var i=0; i<hints.length; i++){
            result.push(<p style={{margin: '0'}}>{ hints[i] }</p>);
        }
        return (<div style={{display: 'flex', flexDirection: 'column'}}>{ result }</div>);
    }

    getRow(problemData){
        const { num, answer, hints, fileURL } = problemData;

        return (<tr>
            <th>{ num }</th>
            <th style={styles.showButton}>
                <a href={ BASE_URL + fileURL } style={{textDecoration: 'none', color: 'white', width: '100%', height: '100%'}}>
                    Show
                </a>
            </th>
            <th>{ answer }</th>
            <th>{ this.getHints(hints) }</th>
            <th style={styles.button} onClick={() => this.deleteProblem(fileURL)}>
                Delete
            </th>
        </tr>);
    }

    getRows(problemsData){
        var rows = [];

        for (var i=0; i<problemsData.length; i++) {
            rows.push(this.getRow(problemsData[i]));
        }

        return rows;
    }

    getTable(problemsData){
        var table = [];
        var header = this.getHeader();
        var rows = this.getRows(problemsData);

        table.push(header);
        table.push(rows);

        return table;
    }

    getTableTitle(classType, problemType){
        return (
            <h2 style={styles.tableTitle}>
                {/*classTypes[classType] +*/ "Type (" + problemTypes[problemType] + ")"}
            </h2>
        );
        // 2019: 전기 only; classType 출력 제외
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
                    var problemsData = data.problems;

                    for (var classType in classTypes){
                        var classTables = [];

                        for (var problemType in problemTypes){
                            var begin = cnt;
                            while (cnt < problemsData.length &&
                            problemsData[cnt].classType == classTypes[classType] &&
                            problemsData[cnt].problemType == problemTypes[problemType]){
                                ++cnt;
                            }
                            var end = cnt;

                            var tableTitle = this.getTableTitle(classType, problemType);
                            var table = this.getTable(problemsData.slice(begin, end));

                            classTables.push(
                                <div style={styles.table}>
                                    { tableTitle }
                                    <div>{ table }</div>
                                </div>
                            );
                        }
                        tables.push(<div style={styles.classTables}>{ classTables }</div>);
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
                <div style={styles.group}>
                    <div className="box" style={styles.box}>
                        <div style={styles.inputLine}>
                            <input type="text" placeholder="번호" style={{width: '50px', textAlign: 'center',}}
                                   onChange={(event) => {inputNum = event.target.value}}/>
                            {/*<select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                                <option value={classTypes[0]}>전기</option>
                                <option value={classTypes[1]}>후기</option>
                            </select>*/}
                            <select defaultValue={inputProblemType} onChange={(event) => {inputProblemType = event.target.value}}>
                                <option value={problemTypes[0]}>A</option>
                                <option value={problemTypes[1]}>B</option>
                                <option value={problemTypes[2]}>C</option>
                            </select>
                            <input type="file" accept=".png, .gif, .jpg, .jpeg, .mp4, .wmv" style={styles.fileInput}
                                   onChange={(event) => {inputFile = event.target.files[0]}}/>
                            <input type="text" placeholder="정답" style={{textAlign: 'center',}}
                                   onChange={(event) => {inputAnswer = event.target.value}}/>
                        </div>
                        <div style={styles.inputLine}>
                            <input type="text" placeholder="힌트(/로 구분해서 입력해주세요)" style={{textAlign: 'center', width: '100%'}}
                                   onChange={(event) => {inputHints = event.target.value.split('/')}}/>
                        </div>
                    </div>
                    <h3 onClick={this.addProblem} style={styles.button}>+ add</h3>
                </div>
                {this.state.tables}
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
    group: {
        display: 'flex',
        flexDirection: 'row',
    },
    tables: {
        marginBottom: '50px',
    },
    classTables: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '16px',
        marginTop : '16px',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        marginLeft: '20px',
        marginRight: '20px',
    },
    box: {
        display: 'flex',
        flexDirection :'column',
    },
    inputLine: {
        display: 'flex',
        flexDirection: 'row',
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
        textAlign: 'center',
        textDecoration: 'underline',
        cursor: 'pointer',
        alignSelf: 'center',
    },
    showButton: {
        textAlign: 'center',
        textDecoration: 'underline',
        alignSelf: 'center',
    },
};

export default withCookies(Problem);
