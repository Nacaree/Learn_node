// 1. First, install the mysql2 package:
// npm install mysql2

// 2. Require the package
const mysql = require("mysql2");

// 3. Create a connection to your MySQL database
const connection = mysql.createConnection({
  host: "localhost", // Your database host
  user: "root", // Your database username
  password: "", // Your database password
  database: "db4flutter", // The name of your database
});

// 4. Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

// 5. Execute a query
// connection.query("SELECT * FROM users", (err, rows) => {
//   if (err) {
//     console.error("Error executing query: " + err.stack);
//     return;
//   }
//   // `rows` will contain the results from the query
//   console.log("User data:", rows);
// });

// 6. Close the connection
connection.end((err) => {
  if (err) {
    console.error("Error closing connection: " + err.stack);
    return;
  }
  console.log("MySQL connection closed.");
});
