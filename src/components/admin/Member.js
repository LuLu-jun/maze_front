import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Member.css'

var classNum='';
var id='';
var pwd='';
var classTypes = new Array("전기", "후기");
var classType = classTypes[0];
var problemTypes='';
var hints = new Array("", "", "");

class Member extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getHints = this.getHints.bind(this);
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
        console.log(classNum);
        console.log(id);
        console.log(pwd);
        console.log(classType);
        console.log(problemTypes);
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
        header.push(<th>Hint codes</th>);
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

    makeData(i){
        return (<tr>
            <th>{i+1}</th>
            <th>{"class" + String(i+1)}</th>
            <th>{"pwd" + String(i+1)}</th>
            <th>전기</th>
            <th>가나나가나가나가나나</th>
            <th>{this.getHints()}</th>
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
                    <div style={styles.inputs}>
                        <div style={styles.inputLine}>
                            <input type="text" style={styles.boxInputStyle} placeholder="class number"
                                   onChange={(event) => {classNum = event.target.value}}/>
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
                                   onChange={(event) => {hints[0] = event.target.value}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="hint code 2"
                                   onChange={(event) => {hints[1] = event.target.value}}/>
                            <input type="text" style={styles.boxInputStyle} placeholder="hint code 3"
                                   onChange={(event) => {hints[2] = event.target.value}}/>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(Member);