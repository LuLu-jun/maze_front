import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Member.css'

var classNum='';
var id='';
var pwd='';
var classType='';
var problemType='';

class Member extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.makeData = this.makeData.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.getTable = this.getTable.bind(this);
        this.state={
            table: this.getTable(),
        }
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && isAdmin);
    }

    addMember(){
        if (!((classType=="전기" || classType=="후기") && (problemType=="가" || problemType=="나"))){
            alert('input type error');
            return;
        }

        console.log(classNum);
        console.log(id);
        console.log(pwd);
        console.log(classType);
        console.log(problemType);
    }

    deleteMember(classNum){
        console.log(classNum);
    }

    getHeader(){
        var header = [];

        header.push(<th>Class</th>);
        header.push(<th>ID</th>);
        header.push(<th>Password</th>);
        header.push(<th>Class Type</th>);
        header.push(<th>Problem Type</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    makeData(i){
        return (<tr>
            <th>{i+1}</th>
            <th>{"class" + String(i+1)}</th>
            <th>{"pwd" + String(i+1)}</th>
            <th>전기</th>
            <th>가</th>
            <th style={styles.button} onClick={() => this.deleteMember(i+1)}>
                Delete
            </th>
        </tr>);
    }

    getDatas(){
        var datas = [];

        for (var i=0; i<30; i++) {
            datas.push(this.makeData(i))
        }

        return datas;
    }

    getTable(){
        var table = [];
        var header = this.getHeader();
        var datas = this.getDatas();

        table.push(header);
        table.push(datas);

        return table;
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
                    <input type="text" style={styles.boxInputStyle} placeholder="class number"
                           onChange={(event) => {classNum = event.target.value}}/>
                    <input type="text" style={styles.boxInputStyle} placeholder="id"
                           onChange={(event) => {id = event.target.value}}/>
                    <input type="text" style={styles.boxInputStyle} placeholder="pwd"
                           onChange={(event) => {pwd = event.target.value}}/>
                    <input type="text" style={styles.boxInputStyle} placeholder="class type (전기 or 후기)"
                           onChange={(event) => {classType = event.target.value}}/>
                    <input type="text" style={styles.boxInputStyle} placeholder="problem type (가 or 나)"
                           onChange={(event) => {problemType = event.target.value}}/>
                    <h3 onClick={this.addMember} style={styles.button}>+ add</h3>
                </div>
                <table>{this.state.table}</table>
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
    box: {
        display: 'flex',
        flexDirection :'row',
        height: '40px',
        alignItems: 'center',
    },
    button: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default connect(mapStateToProps)(Member);