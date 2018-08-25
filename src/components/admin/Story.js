import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Story.css'

var classTypes = new Array("전기", "후기");
var inputNum = '';
var inputClassType = classTypes[0];
var inputFile = undefined;

class Story extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.addStory = this.addStory.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
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

    addStory(){
        console.log(inputNum);
        console.log(inputClassType);
        console.log(inputFile);
    }

    deleteStory(classType, num){
        console.log('delete');
        console.log(classType, num);
    }

    showStory(classType, num){
        console.log('show');
        console.log(classType, num);
    }

    getHeader(){
        var header = [];

        header.push(<th>Num</th>);
        header.push(<th>Show</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    makeData(classType, k){
        return (<tr>
            <th>{k+1}</th>
            <th style={styles.button} onClick={() => this.showStory(classType, k+1)}>
                Show
            </th>
            <th style={styles.button} onClick={() => this.deleteStory(classType, k+1)}>
                Delete
            </th>
        </tr>);
    }

    getDatas(classType){
        var datas = [];

        for (var k=0; k<10; k++) {
            datas.push(this.makeData(classType, k))
        }

        return datas;
    }

    getTable(classType){
        var table = [];
        var header = this.getHeader();
        var datas = this.getDatas(classType);

        table.push(header);
        table.push(datas);

        return table;
    }

    getTableTitle(classType){
        return (
            <h2 style={styles.tableTitle}>{classTypes[classType]}</h2>
        );
    }

    getTables(){
        var tables = [];

        for (var classType in classTypes){
            tables.push(
                <div style={styles.table}>
                    {this.getTableTitle(classType)}
                    <div>{this.getTable(classType)}</div>
                </div>
            );
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
                <div className="box" style={styles.box}>
                    <input type="text" placeholder="번호" style={{width: '50px', textAlign: 'center',}}
                           onChange={(event) => {inputNum = event.target.value}}/>
                    <select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                        <option value={classTypes[0]}>전기</option>
                        <option value={classTypes[1]}>후기</option>
                    </select>
                    <input type="file" accept=".png" style={styles.fileInput}
                           onChange={(event) => {inputFile = event.target.files[0]}}/>
                    <h3 onClick={this.addStory} style={styles.button}>+ add</h3>
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
};

export default connect(mapStateToProps)(Story);