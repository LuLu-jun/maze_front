import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import './Class.css'

function getHeader(){
    var header = [];

    header.push(<th>Class</th>);
    header.push(<th>Problem 1</th>);
    header.push(<th>Problem 2</th>);
    header.push(<th>Problem 3</th>);
    header.push(<th>Problem 4</th>);
    header.push(<th>Problem 5</th>);
    header.push(<th>Problem 6</th>);
    header.push(<th>Problem 7</th>);
    header.push(<th>Problem 8</th>);
    header.push(<th>Problem 9</th>);

    return (<tr>{header}</tr>);
}

function makeData(i){
    return (<tr>
        <th>{i+1}</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
        <th>11:22:33</th>
    </tr>);
}

function getDatas(){
    var datas = [];

    for (var i=0; i<30; i++) {
        datas.push(makeData(i))
    }

    return datas;
}

function getTable(){
    var table = [];
    var header = getHeader();
    var datas = getDatas();

    table.push(header);
    table.push(datas);

    return table;
}

class Class extends Component {
    constructor(props) {
        super(props);
        this.valid = this.valid.bind(this);
        this.table = getTable();
    }

    valid(){
        const userId = this.props.userId;
        const isAdmin = this.props.isAdmin;
        return (userId!=undefined && isAdmin!=undefined && userId!=="" && isAdmin);
    }

    render() {
        if (!this.valid()){
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div className="container" style={styles.container}>
                <table>{this.table}</table>
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
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default connect(mapStateToProps)(Class);