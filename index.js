const fs = require("fs");
const mysql = require("mysql2");
const fastcsv = require("fast-csv");
require('dotenv').config();

let stream = fs.createReadStream("Inventory.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
   
    // create a new connection to the database
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "Inventory_DB"
      });
  
      // open the connection
      connection.connect(error => {
        if (error) {
          console.error(error);
        } else {
          let query =
            "REPLACE INTO Inventory_details (Inv_id, Inv_name, Description, model, Price, Available_no) VALUES ?";
          connection.query(query, [csvData], (error, response) => {
            console.log(error || response);
          });
        }
      });
    });
stream.pipe(csvStream);








