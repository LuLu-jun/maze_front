import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { BASE_URL, API_ADMIN_ENDING_URL } from "../../URL";
import './Story.css';

var classTypes = new Array('전기');//new Array("전기", "후기"); 2019: 전기 only
var inputClassType = classTypes[0];
var inputFile = undefined;
var REAL_API_URL = '';

class Ending extends Component {
    constructor(props) {
        super(props);

        const cookieId = this.props.cookies.get('id') || '';
        const cookiePwd = this.props.cookies.get('pwd') || '';
        REAL_API_URL = API_ADMIN_ENDING_URL + "/" + cookieId + "/" + cookiePwd;

        var validAccess = true;
        if (cookieId == '' || cookiePwd == '') { validAccess = false; }

        this.addEnding = this.addEnding.bind(this);
        this.deleteEnding = this.deleteEnding.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getRow = this.getRow.bind(this);
        this.getRows = this.getRows.bind(this);
        this.getTable = this.getTable.bind(this);
        this.state={
            validAccess: validAccess,
            table: '',
        };
        if (validAccess)
            this.getTable();
    }

    addEnding(){
        var formData = new FormData();
        formData.append('classType', inputClassType);
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
                else { this.getTable(); }
            })
            .catch( response => { alert(response) } );
    }

    deleteEnding(fileURL){
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
                else { this.getTable(); }
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

        //header.push(<th>Class Type</th>);
        header.push(<th>Show</th>);
        header.push(<th>Delete</th>);

        return (<tr>{header}</tr>);
    }

    getRow(endingData){
        const { classType, fileURL } = endingData;

        return (<tr>
            {/*<th>{ classType }</th>*/}
            <th style={styles.showButton}>
                <a href={ BASE_URL + fileURL } style={{textDecoration: 'none', color: 'white', width: '100%', height: '100%'}}>
                    Show
                </a>
            </th>
            <th style={styles.button} onClick={() => this.deleteEnding(fileURL)}>
                Delete
            </th>
        </tr>);
    }

    getRows(endingsData){
        var rows = [];

        for (var i=0; i<endingsData.length; i++) {
            rows.push(this.getRow(endingsData[i]));
        }

        return rows;
    }

    getTable(){
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
                    var table = [];
                    var header = this.getHeader();
                    var rows = this.getRows(data.endings);

                    table.push(header);
                    table.push(rows);

                    this.setState({
                        table: <div>{table}</div>,
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
                    {/*<select defaultValue={inputClassType} onChange={(event) => {inputClassType = event.target.value}}>
                        <option value={classTypes[0]}>전기</option>
                        <option value={classTypes[1]}>후기</option>
                    </select>*/}
                    <input type="file" accept=".png, .gif, .jpg, .jpeg, .mp4, .wmv" style={styles.fileInput}
                           onChange={(event) => {inputFile = event.target.files[0]}}/>
                    <h3 onClick={this.addEnding} style={styles.button}>+ add</h3>
                </div>
                <div style={styles.table}>
                    {this.state.table}
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

export default withCookies(Ending);
