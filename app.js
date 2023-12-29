const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const inti = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Running Successfully");
    });
  } catch (e) {
    console.log(`DB error${e.message}`);
    process.exit(1);
  }
};

inti();

app.get("/todos/", async (request, response) => {
  const { status = "", priority = "", todo = "" } = request.query;
  const query = `select * from todo where status LIKE '%${status}%'
  and priority like '%${priority}%' and todo like '%${todo}%';
    `;
  const responseAll = await db.all(query);
  response.send(responseAll);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `select * from todo where id = ${todoId}`;
  const idResponse = await db.get(query);
  response.send(idResponse);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `INSERT INTO todo(id, todo, priority, status) VALUES(${id},
        '${todo}','${priority}','${status}')`;
  await db.run(query);
  response.send("Todo Successfully Added");
});
