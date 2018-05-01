import express from "express";
import bodyParser from "body-parser";
import TodoService from "./service.js";
const API_PREFIX = "/api/v1";

const getApiRoute = path => `${API_PREFIX}${path}`;

const routePaths = {
  todos: "/todos/",
  archived: "/todos/archived/",
  todo: "/todos/:id/",
  reorder: "/todos/reorder/",
  archive: "/todos/archive/",
  unarchive: "/todos/unarchive/"
};

const service = new TodoService();
service.init();

const app = express();
app.use(bodyParser.json());

app.get(getApiRoute(routePaths.todos), async (req, res) => {
  const data = await service.getAll();

  return res.json(data);
});

// get all archived todos
app.get(getApiRoute(routePaths.archive), async (req, res) => {
  const data = await service.getAll("archive");

  return res.json(data);
});

// create a todo
app.post(getApiRoute(routePaths.todos), async (req, res) => {
  const { title, priority } = req.body;

  const data = await service.create(title, priority);
  return res.json(data);
});

// update a todo
app.put(getApiRoute(routePaths.todo), async (req, res) => {
  const { id } = req.params;
  const options = req.body;

  const data = await service.update(id, options);
  return res.json(data);
});

// reorder a todo
app.post(getApiRoute(routePaths.reorder), async (req, res) => {
  const { todoId, previousId } = req.body;

  const data = await service.reorder(todoId, previousId);
  return res.json(data);
});

app.post(getApiRoute(routePaths.archive), async (req, res) => {
  const { todoId } = req.body;

  const data = await service.archive(todoId);
  return res.json(data);
});

app.post(getApiRoute(routePaths.unarchive), async (req, res) => {
  const { todoId } = req.body;

  const data = await service.unarchive(todoId);
  return res.json(data);
});

app.listen(3001);
