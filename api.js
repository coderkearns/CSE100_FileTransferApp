const express = require("express")
const fs = require("fs")
const path = require("path")

const api = express.Router()


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

//  curl http://0.0.0.0:5000/api/:file/download
api.get("/:file/download", (req, res, next) => {
    fs.exists(files(req.params.file), exists => {
      if (!exists) return next(error("404", "That file does not exist"))
      res.download(files(req.params.file))
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
    console.error(err)
    res.json({ error: err.status, message: err.message })
})

module.exports = api