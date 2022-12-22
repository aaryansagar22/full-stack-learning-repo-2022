const express = require("express");
const cors = require("cors");
const todo = express.Router();
const middleware = require("../middleware/functions");
const db = require("../firebase").firestore();
todo.use(cors());
todo.use(express.json());

todo.get("/", (req,res) => {
    
});

todo.post("/", (req,res) => {

})

module.exports = todo;