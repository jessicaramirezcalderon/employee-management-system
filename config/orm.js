// Import MySQL connection.
const connection = require("../config/connection.js");

// Helper function for SQL syntax.

function printQuestionMarks(num) {
  const arr = [];

  for (let i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  const arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (let key in ob) {
    let value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations
      if (typeof value === "string") {
        value = "'" + value + "'";
      }
 
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}


// Object for all our SQL statement functions.
const orm = {
  all: function(tableInput, cb) {
    let queryString = "SELECT * FROM " + tableInput + ";";
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      if (cb) {
        cb(result);
      }
    });
  },
  create: function(table, cols, vals, cb) {
    let queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }

      if (cb) {
        cb(result);
      }
    });
  },
  delete: function(table, condition, cb) {
    let queryString = "DELETE FROM " + table;

    queryString += " WHERE ";
    queryString += condition;

    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }

      if (cb) {
        cb(result);
      }
    });
  },

  update: function(table, objColVals, condition, cb) {
    let queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      if (cb) {
        cb(result);
      }
    });
  },
  delete: function(table, condition, cb) {
    let queryString = "DELETE FROM " + table;

    queryString += " WHERE ";
    queryString += condition;

    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      if (cb) {
        cb(result);
      }
    });
  },
};

// Export the orm object
module.exports = orm;
