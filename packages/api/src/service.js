import path from "path";
import Datastore from "nedb-promise";
import cuid from "cuid";

const DEFAULT_PATH = path.join(__dirname, "..", "db", "dev.db");

const types = {
  todo: "todo",
  list: "list",
  todoList: "todoList"
};
const defaultLists = [
  { id: "active", type: types.list, title: "Todos" },
  { id: "archive", type: types.list, title: "Archive" }
];

function getDb(db, inMemory, dbPath) {
  if (db) {
    return db;
  }

  return inMemory
    ? new Datastore()
    : new Datastore({ filename: dbPath, autoload: true });
}

class TodoService {
  constructor({ inMemory = false, dbPath = DEFAULT_PATH, db = null } = {}) {
    this.db = getDb(db, inMemory, dbPath);
  }

  // Determines if the init function should be run based on the presence of the default lists
  shouldInitialize = async () => {
    const listIds = defaultLists.map(l => l.id);
    const lists = await this.db.find({
      type: types.list,
      id: { $in: listIds }
    });

    return !lists.length;
  };

  // Initializes the "datastore" if necessary
  init = async () => {
    if (await this.shouldInitialize()) {
      return await this.db.insert(defaultLists);
    }

    return null;
  };

  appendTail = async (todoId, listId = "active") => {
    // find the list
    const last = await this.db.findOne({
      type: types.todoList,
      listId,
      nextId: null
    });

    const listRecord = {
      listId,
      todoId: todoId,
      nextId: null,
      type: types.todoList,
      previousId: last ? last.todoId : null
    };

    const resolvedListRecord = await this.db.insert(listRecord);

    // update the record previously set as last
    if (last) {
      await this.db.update(
        { todoId: last.todoId, type: types.todoList },
        { $set: { nextId: todoId } }
      );
    }

    return resolvedListRecord;
  };

  getTodoListItem = async (todoId, listId = "active") => {
    return await this.db.findOne({
      type: types.todoList,
      listId,
      todoId: todoId
    });
  };

  getFirstNode = async (listId = "active") => {
    return await this.db.findOne({
      type: types.todoList,
      listId,
      previousId: null
    });
  };

  updateTodoListItem = async ({ todoId, listId = "active", options }) => {
    await this.db.update(
      { todoId: todoId, type: types.todoList, listId },
      { $set: options }
    );
  };

  remove = async (todoId, listId = "active") => {
    //update record's previous / next
    const record = await this.getTodoListItem(todoId);

    if (record.nextId) {
      await this.updateTodoListItem({
        todoId: record.nextId,
        options: { previousId: record.previousId }
      });
    }

    if (record.previousId) {
      await this.updateTodoListItem({
        todoId: record.previousId,
        options: { nextId: record.nextId }
      });
    }

    const removed = await this.db.remove({ _id: record._id });

    return {
      ...record,
      previousId: null,
      nextId: null,
      listId: null,
      updateDate: new Date()
    };
  };

  archive = async todoId => {
    const record = await this.getTodoListItem(todoId);

    const item = await this.remove(todoId);
    return await this.db.insert({ ...item, listId: "archive" });
  };

  unarchive = async todoId => {
    const record = await this.getTodoListItem(todoId, "archive");

    const removed = this.db.remove({ _id: record._id });
    return await this.appendTail(todoId);
  };

  reorder2 = async (todoId, previousId, listId = "active") => {
    const previousRecord = previousId
      ? await this.getTodoListItem(previousId)
      : null;

    const nextId = (previousRecord && previousRecord.nextId) || null;

    const nextRecord =
      previousId === null
        ? await this.getFirstNode()
        : await this.getTodoListItem(nextId);

    // this is the only thing already so bail
    if (!previousRecord && !nextRecord) {
      return;
    }

    const newRecord = {
      todoId: todoId,
      nextId: nextRecord ? nextRecord.todoId : null,
      previousId: previousRecord ? previousRecord.todoId : null
    };

    //update previous
    const previousUpdated = previousRecord
      ? await this.updateTodoListItem({
          todoId: previousRecord.todoId,
          options: { nextId: newRecord.todoId }
        })
      : null;

    if (previousRecord) {
      await this.updateTodoListItem({
        todoId: previousRecord.todoId,
        options: { nextId: newRecord.todoId }
      });
    }

    if (nextRecord) {
      await this.updateTodoListItem({
        todoId: nextRecord.todoId,
        options: { previousId: newRecord.todoId }
      });
    }

    return await this.updateTodoListItem({
      todoId,
      options: newRecord
    });
  };

  reorder = async (todoId, previousId, listId = "active") => {
    const previousRecord = previousId
      ? await this.getTodoListItem(previousId)
      : null;

    const nextId = (previousRecord && previousRecord.nextId) || null;

    const nextRecord =
      previousId === null
        ? await this.getFirstNode()
        : await this.getTodoListItem(nextId);

    // this is the only thing already so bail
    if (!previousRecord && !nextRecord) {
      return;
    }

    const removedRecord = await this.remove(todoId);

    const newRecord = {
      ...removedRecord,
      nextId: nextRecord ? nextRecord.todoId : null,
      previousId: previousRecord ? previousRecord.todoId : null,
      listId: "active",
      updateDate: new Date()
    };

    //update previous
    const previousUpdated = previousRecord
      ? await this.updateTodoListItem({
          todoId: previousRecord.todoId,
          options: { nextId: newRecord.todoId }
        })
      : null;

    if (previousRecord) {
      await this.updateTodoListItem({
        todoId: previousRecord.todoId,
        options: { nextId: newRecord.todoId }
      });
    }

    if (nextRecord) {
      await this.updateTodoListItem({
        todoId: nextRecord.todoId,
        options: { previousId: newRecord.todoId }
      });
    }

    return await this.db.insert(newRecord);
  };

  // builds a full todo item from title / priority
  buildTodo = (title, priority) => {
    return {
      id: cuid(),
      type: types.todo,
      title,
      priority,
      createDate: new Date(),
      updateDate: new Date(),
      isComplete: false
    };
  };

  create = async (title, priority) => {
    const todo = this.buildTodo(title, priority);
    const record = await this.db.insert(todo);

    this.appendTail(todo.id);
    return record;
  };

  update = async (todoId, options) => {
    const updated = await this.db.update(
      { id: todoId, type: types.todo },
      { $set: options }
    );

    return updated;
  };

  getAll = async (listId = "active") => {
    const metadata = await this.db.find({ type: types.todoList, listId });

    const ids = metadata.map(m => m.todoId);
    const todoList = await this.db.find({ id: { $in: ids } });

    return { todoList, metadata };
  };
}

export default TodoService;
