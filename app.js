const express = require("express")
const app = express()

const api = require("./api")
app.use("/api", api)

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})

module.exports = app
