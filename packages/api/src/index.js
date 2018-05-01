import express from "express";
import bodyParser from "body-parser";

const API_PREFIX = "/api/v1";

const app = express();
app.use(bodyParser.json());

app.get(`${API_PREFIX}/`, (req, res) => {
  return res.json({ greeting: "hello" });
});

app.listen(3001);
