const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
module.exports = app

// TODO: The base app is for a website to advertise the app.

const api = express.Router()
app.use("/api", api)

function error(status, msg) {
  let err = new Error(msg)
  err.status = status
  return err
}

function files(...args) {
  return path.join(__dirname, "files", ...args)
}

// curl http://0.0.0.0:5000/api/
api.get("/", (req, res, next) => {
  fs.readdir(files(), (err, files) => {
    if (err) return next(error(500, "Internal Server Error"))
    res.json(files)
  })
})

// curl http://0.0.0.0:5000/api/:file > file-to-save.txt
api.get("/:file", (req, res, next) => {
  fs.exists(files(req.params.file), exists => {
    if (!exists) return next(error("404", "That file does not exist"))
    res.sendFile(files(req.params.file))
  })
})

// curl -X POST http://0.0.0.0:5000/api/:filename -d @./path/to/my/file
// or
// curl -X POST http://0.0.0.0:5000/api/:filename -d "$(somecommands | thatoutput | text)"
api.post("/:file", (req, res, next) => {
  req.pipe(fs.createWriteStream(files(req.params.file)))
  req.on("end", () => {
    res.sendStatus(200)
  })
  req.on("err", (err) => next(error(500, err.message)))
})

api.use((err, req, res, next) => {
  res.json({ error: err.status, message: err.message })
})
