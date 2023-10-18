
//OPTIONAL TASK ERROR HANDLING

const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json()); 

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "siddhi11",
    database: "dac"
});
con.connect(function (err) {
    if (!err)
        console.log('db connected');
    else
        console.log('db connection failed');
});

app.listen(9000, function () {
    console.log("exp server started at 9000");
});

// Retrieve all list of users

app.get('/emps', function (req, res) {
    con.query('select * from emptable ', function (err, result) {
        if (!err) {
            res.write("<table border=1>");
            result.forEach(function (v) {
                res.write("<tr>");
                res.write("<td>" + v.EMPNO + "</td>");
                res.write("<td>" + v.ENAME + "</td>");
                res.write("<td>" + v.JOB + "</td>");
                res.write("<td>" + v.DEPTNO + "</td>");
                res.write("</tr>");
            });
            res.write("</table>");
            res.end();
        }
    });
});

//To Create new User 

app.post('/emps', function (req, res) {
    
    const { EMPNO, ENAME, JOB, DEPTNO } = req.body;

    
    const query = 'INSERT INTO emptable (EMPNO, ENAME, JOB, DEPTNO) VALUES (?, ?, ?, ?)';
    con.query(query, [EMPNO, ENAME, JOB, DEPTNO], function (err, result) {
        if (!err) {
            res.status(201).json({ message: 'Employee added successfully' });
        } else {
            res.status(500).json({ error: 'Failed to add employee' });
        }
    });
});

//To update new User 
app.put('/emps/:empId', function (req, res) {
    const empId = req.params.empId; 
    const { ENAME, JOB, DEPTNO } = req.body; 

    
    const query = 'UPDATE emptable SET ENAME = ?, JOB = ?, DEPTNO = ? WHERE EMPNO = ?';
    con.query(query, [ENAME, JOB, DEPTNO, empId], function (err, result) {
        if (!err) {
            res.json({ message: 'Employee updated successfully' });
        } else {
            res.status(500).json({ error: 'Failed to update employee' });
        }
    });
});

//TO delete User using perticular unique id 

app.delete('/emps/:empId', function (req, res) {
    const empId = req.params.empId; 

    
    const query = 'DELETE FROM emptable WHERE EMPNO = ?';
    con.query(query, [empId], function (err, result) {
        if (!err) {
            res.json({ message: 'Employee deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete employee' });
        }
    });
});


//to Retrive user from unique id 

app.get('/emps/:empNo', function (req, res) {
    const empNo = req.params.empNo; 
    con.query('select * from emptable where EMPNO = ? ', [empNo],function (err, result) {
        if (!err) {
            res.write("<table border=1>");
            result.forEach(function (v) {
                res.write("<tr>");
                res.write("<td>" + v.EMPNO + "</td>");
                res.write("<td>" + v.ENAME + "</td>");
                res.write("<td>" + v.JOB + "</td>");
                res.write("<td>" + v.DEPTNO + "</td>");
                res.write("</tr>");
            });
            res.write("</table>");
            res.end();
        }
    });
});

//to check if the its worng url the printing in browser window

app.all('*', function (req, res) {
    res.send("Incorrect URL");
});

