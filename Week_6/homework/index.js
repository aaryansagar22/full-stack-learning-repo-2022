const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();

const PORT = process.env.PORT

app.use("/auth", require("./routes/auth.js"));
app.use("/todo", require("./routes/todo.js"));

// TODO: we are currently listening to port 3000, lets define an environment variable and use that instead
app.listen(PORT, () => console.log("App listening on port " + PORT));