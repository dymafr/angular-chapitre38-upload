const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.static('files'));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "files"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

app.post("/api/files", upload.array("f"), (req, res, next) => {
  res.end();
});

app.delete("/api/files/:filename", (req, res, next) => {
  const { filename } = req.params;
  fs.unlink(path.join(__dirname, `files/${filename}`), err => {
    res.end();
  });
});

app.use((err, req, res, next) => {
  res.status(500).end();
});

app.listen(3000);
