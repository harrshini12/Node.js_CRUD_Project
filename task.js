const express = require('express');
const mysql = require('mysql2');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "Inventory_DB"
});

// set EJS as default view rendered
app.set('view engine', 'ejs')

app.use(express.json())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.render('index')
})

//Get data for a Inventory
app.get('/getdata', function(req, res) {
    let query = "SELECT * FROM Inventory_details WHERE `Inv_id` = ? ";
    connection.query(query, [req.query.Inv_id], function(err, result) {
        if (err) {
            res.send('THERE WAS AN ERROR!!!! 🙀')
            return
        }
        console.log(result);
        res.json(result)
    })
});

//Create a new Inventory
app.post('/addInventory', function(req, res) {
    const Inv_id = req.body.Inv_id;
    const Inv_name = req.body.Inv_name;
    const Description = req.body.Description;
    const model = req.body.model;
    const Price = req.body.Price;
    const Available_no = req.body.Available_no;

    const query = `INSERT INTO Inventory_details (Inv_id, Inv_name, Description, model, Price, Available_no) VALUES (?, ?, ?, ?, ?, ?)`
    connection.query(query, [Inv_id, Inv_name, Description, model, Price, Available_no],  function(err, result) {
        if (err) {
            console.log(err)
            res.json({
                status: "NOT OK!"
            })
            return
        }
        console.log("1 row inserted successfully");
        res.json({
            status: "OK",
            description: "1 row inserted successfully"
        })
    })
})

//Update Inventory name
app.post('/updateInventory', function(req, res) {
    let query = "update Inventory_details set Inv_id = ? where Inv_name = ?  ";
    connection.query(query,[req.body.Inv_id, req.body.Inv_name], function(err, result) {
        if (err) {
            res.send('THERE WAS AN ERROR!!!! 🙀')
            return
        }
        console.log("updated sucessfully");
        res.json({
            status: "OK",
            description: "updated sucessfully",
        })
    })
});

//Get all inventory name, who's price is 10.
app.get('/inventoryprice', function(req, res) {
    let query = "SELECT Inv_name FROM Inventory_details WHERE Price = ? ";
    connection.query(query, [req.query.Price], function(err, result) {
        if (err) {
            res.send('THERE WAS AN ERROR!!!! 🙀')
            return
        }
        console.log(result);
        res.json(result)
    })
});

//Get the list of inventory with a certain attribute, i.e.: all inventory with Faber-Castell Brand
app.get('/inventoryBrand', function(req, res) {
    let query = "SELECT * FROM Inventory_details WHERE Description like '% "+ req.query.attribute + "%'"
    connection.query(query, function(err, result) {
        if (err) {
            res.send('THERE WAS AN ERROR!!!! 🙀')
            return
        }
        console.log(result);
        res.json(result)
    })
});

//Delete one inventory details
app.get('/DeleteInv', function(req, res) {
    let query = "DELETE FROM Inventory_details WHERE `Inv_id` = ? ";
    connection.query(query, [req.query.Inv_id], function(err, result) {
        if (err) {
            res.send('THERE WAS AN ERROR!!!! 🙀')
            return
        }
        console.log(result);
        res.json(result)
    })
});

app.listen(port, function() {
    console.log(`listening on ${port}`)
});