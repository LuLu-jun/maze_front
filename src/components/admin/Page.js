import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Page.css'

var pageTypes = new Array("문제", "스토리");
var classTypes = new Array("전기", "후기");
var problemTypes = new Array("가", "나");
var inputPageType = pageTypes[0];
var inputNum = '';
var inputClassType = classTypes[0];
var inputProblemType = problemTypes[0];
var inputFile = undefined;

class Page extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.addPage = this.addPage.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.makeData = this.makeData.bind(this);
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
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    makeData(classType, problemType, k){
        return (<tr>
            <th>{k+1}</th>
            <th style={styles.button} onClick={() => this.showPage(classType, problemType, k+1)}>
                Show
            </th>
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
        if (problemType == -1){
            return (
                <h2 style={styles.tableTitle}>{classTypes[classType]}</h2>
            );
        }

        return (
            <h2 style={styles.tableTitle}>
                {classTypes[classType] + " (" + problemTypes[problemType] + ")"}
            </h2>
        );
    }

    getTables(){
        var tables = new Map();
        var storyTables = [];
        var problemTables = [];

        for (var classType in classTypes){
            storyTables.push(
                <div style={styles.table}>
                    {this.getTableTitle(classType, -1)}
                    <div>{this.getTable(classType, -1)}</div>
                </div>
            );
            for (var problemType in problemTypes){
                problemTables.push(
                    <div style={styles.table}>
                        {this.getTableTitle(classType, problemType)}
                        <div>{this.getTable(classType, problemType)}</div>
                    </div>
                );
            }
        }
        tables.set(pageTypes[0], storyTables);
        tables.set(pageTypes[1], problemTables);

        return tables;
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <div className="box" style={styles.box}>
                    <select defaultValue={inputPageType} onChange={(event) => {inputPageType = event.target.value}}>
                        <option value={pageTypes[0]}>문제</option>
                        <option value={pageTypes[1]}>스토리</option>
                    </select>
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
                    <h3 onClick={this.addPage} style={styles.button}>+ add</h3>
                </div>
                <div style={styles.group}>
                    <h1 style={styles.tableTitle}>스토리</h1>
                    <div style={styles.tables}>
                        {this.state.tables.get(pageTypes[0])}
                    </div>
                    <h1 style={styles.tableTitle}>문제</h1>
                    <div style={styles.tables}>
                        {this.state.tables.get(pageTypes[1])}
                    </div>
                </div>
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
        flexDirection: 'column',
        alignItems: 'start',
    },
    tables:{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '50px',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
        marginRight: '20px',
    },
    box: {
        width: '600px',
        display: 'flex',
        flexDirection :'row',
        justifyContent: 'space-between',
        height: '40px',
        alignItems: 'center',
    },
    fileInput: {
        color: 'white',
    },
    tableTitle: {
        color: 'white',
        margin: '0',
    },
    button: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default connect(mapStateToProps)(Page);