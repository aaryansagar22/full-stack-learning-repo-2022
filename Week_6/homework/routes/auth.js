const express = require("express");
const cors = require("cors");
const middleware = require("../middleware/functions");
const firebase = require("../firebase");
const db = firebase.firestore;
const auth = express.Router();
auth.use(cors());
auth.use(express.json());

class Auth {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.requiredFields = () => {
            return ["username", "password"];
          };
    }
}
class AuthWithEmail extends Auth{
    constructor(email, password, username) {
        super(username, password);
        this.email = email;
        this.requiredFields = () => {
            return ["email", "password", "username"];
          };
    }
}

auth.post("/register", middleware.validateSchema(AuthWithEmail), async (req, res) => {
    let username = req.body.username;
    let users = db.collection("users");
    let currentDoc = await users.doc(username).get();
    if (currentDoc.exists) {
        let m = username + " username already exists";
        res.status(400).json({msg: m});
    }
    else {
        let data = {todo: {}, email: req.body.email, password: req.body.password};
        await users.doc(username).set(data);
        let m = "User with " + username + " has been successfully made.";
        res.status(200).json({msg: m});
    }

}, middleware.handleErrors);

auth.post("/login", middleware.validateSchema(Auth), async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let users = db.collection("users");
    let currentDoc = await users.doc(username).get();
    if (currentDoc.exists && currentDoc.data().password == password) {
        let m = "Successfully Logged In";
        res.status(200).json({msg: m});
    }
    else {
        let m = "Unsuccessful login";
        res.status(400).json({msg: m});
    }
}, middleware.handleErrors);

module.exports = auth;