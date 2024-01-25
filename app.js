const express = require("express");
const app = express();
const port = 3000;
const routes = require('./routes/index');
const session = require('express-session')

//Setting EJS
app.set("view engine", "ejs");

//Setting agar kita bisa menerima data dari body
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'seckret-key',
    resave: false,
    saveUninitialized: false,
  }))

app.use("/", routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
