import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Problem.css'

var pageTypes = new Array("문제", "스토리");
var classTypes = new Array("전기", "후기");
var problemTypes = new Array("가", "나");
var inputPageType = pageTypes[0];
var inputNum = '';
var inputClassType = classTypes[0];
var inputProblemType = problemTypes[0];
var inputFile = undefined;
var inputAnswer = "";
var inputHints = new Array("", "", "");

class Problem extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.addPage = this.addPage.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.makeData = this.makeData.bind(this);
        this.getHints = this.getHints.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.getTable = this.getTable.bind(this);
        this.getTableTitle = this.getTableTitle.bind(this);
        this.getTables = this.getTables.bind(this);
        this.state={
            tables: this.getTables(),
        }
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && isAdmin);
    }

    addPage(){
        console.log(inputPageType);
        console.log(inputNum);
        console.log(inputClassType);
        console.log(inputProblemType);
        console.log(inputFile);
    }

    deletePage(classType, problemType, k){
        console.log('delete');
        console.log(classType, problemType, k);
    }

    showPage(classType, problemType, k){
        console.log('show');
        console.log(classType, problemType, k);
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

    getHints(){
        var hints = [];
        for (var i=0; i<3;i ++){
            hints.push(<p style={{margin: '0'}}>sdfsddfssfdsdsdf</p>);
        }
        return (<div style={{display: 'flex', flexDirection: 'column'}}>{hints}</div>);
    }

    makeData(classType, problemType, k){
        return (<tr>
            <th>{k+1}</th>
            <th style={styles.button} onClick={() => this.showPage(classType, problemType, k+1)}>
                Show
            </th>
            <th>{"answer" + String(k+1)}</th>
            <th>{this.getHints()}</th>
            <th style={styles.button} onClick={() => this.deletePage(classType, problemType, k+1)}>
                Delete
            </th>
        </tr>);
    }

    getDatas(classType, problemType){
        var datas = [];

        for (var k=0; k<10; k++) {
            datas.push(this.makeData(classType, problemType, k))
        }

        return datas;
    }

    getTable(classType, problemType){
        var table = [];
        var header = this.getHeader();
        var datas = this.getDatas(classType, problemType);

        table.push(header);
        table.push(datas);

        return table;
    }

    getTableTitle(classType, problemType){
        return (
            <h2 style={styles.tableTitle}>
                {classTypes[classType] + " (" + problemTypes[problemType] + ")"}
            </h2>
        );
    }

    getTables(){
        var tables = [];
        var classTables = [];

        for (var classType in classTypes){
            for (var problemType in problemTypes){
                classTables.push(
                    <div style={styles.table}>
                        {this.getTableTitle(classType, problemType)}
                        <div>{this.getTable(classType, problemType)}</div>
                    </div>
                );
            }
            tables.push(<div style={styles.classTables}>{classTables}</div>);
            classTables = [];
        }

        return (<div style={styles.tables}>{tables}</div>);
    }

    render() {
        if (!this.valid()){
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
                            <select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                                <option value={classTypes[0]}>전기</option>
                                <option value={classTypes[1]}>후기</option>
                            </select>
                            <select defaultValue={inputProblemType} onChange={(event) => {inputProblemType = event.target.value}}>
                                <option value={problemTypes[0]}>가</option>
                                <option value={problemTypes[1]}>나</option>
                            </select>
                            <input type="file" accept=".png" style={styles.fileInput}
                                   onChange={(event) => {inputFile = event.target.files[0]}}/>
                            <input type="text" placeholder="정답" style={{textAlign: 'center',}}
                                   onChange={(event) => {inputAnswer = event.target.value}}/>
                        </div>
                        <div style={styles.inputLine}>
                            <input type="text" placeholder="힌트 1" style={{textAlign: 'center',}}
                                   onChange={(event) => {inputHints[0] = event.target.value}}/>
                            <input type="text" placeholder="힌트 2" style={{textAlign: 'center',}}
                                   onChange={(event) => {inputHints[1] = event.target.value}}/>
                            <input type="text" placeholder="힌트 3" style={{textAlign: 'center',}}
                                   onChange={(event) => {inputHints[2] = event.target.value}}/>
                        </div>
                    </div>
                    <h3 onClick={this.addPage} style={styles.button}>+ add</h3>
                </div>
                {this.state.tables}
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return ({
        userId: state.login.userId,
        isAdmin: state.login.isAdmin,
    });
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
};

export default connect(mapStateToProps)(Problem);