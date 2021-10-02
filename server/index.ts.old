const cool = require("cool-ascii-faces");
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, "../public")))
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/posts", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM test_table");
      //console.log(result);
      res.json(result ? result.rows : []);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get("/posts/:id", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM posts");
      //console.log(result);
      res.json(result ? result.rows : []);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get("/users", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM users");
      const users = {};
      (result ? result.rows : []).forEach((r) => {
        users[r.id] = r;
      });
      //console.log(users);
      res.json(users);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get("/cool", (req, res) => res.send(cool()))
  .get("/times", (req, res) => res.send(showTimes()))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const showTimes = () => {
  let result = "";
  const times = process.env.TIMES || 5;
  for (let i = 0; i < times; i++) {
    result += i + " ";
  }
  return result;
};
