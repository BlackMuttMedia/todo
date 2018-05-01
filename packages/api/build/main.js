require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_js__ = __webpack_require__(4);



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

const service = new __WEBPACK_IMPORTED_MODULE_2__service_js__["a" /* default */]();
service.init();

const app = __WEBPACK_IMPORTED_MODULE_0_express___default()();
app.use(__WEBPACK_IMPORTED_MODULE_1_body_parser___default.a.json());

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nedb_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nedb_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nedb_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cuid__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_cuid__);




const DEFAULT_PATH = __WEBPACK_IMPORTED_MODULE_0_path___default.a.join(__dirname, "..", "db", "dev.db");

const types = {
  todo: "todo",
  list: "list",
  todoList: "todoList"
};
const defaultLists = [{ id: "active", type: types.list, title: "Todos" }, { id: "archive", type: types.list, title: "Archive" }];

function getDb(db, inMemory, dbPath) {
  if (db) {
    return db;
  }

  return inMemory ? new __WEBPACK_IMPORTED_MODULE_1_nedb_promise___default.a() : new __WEBPACK_IMPORTED_MODULE_1_nedb_promise___default.a({ filename: dbPath, autoload: true });
}

class TodoService {
  constructor({ inMemory = false, dbPath = DEFAULT_PATH, db = null } = {}) {
    this.shouldInitialize = async () => {
      const listIds = defaultLists.map(l => l.id);
      const lists = await this.db.find({
        type: types.list,
        id: { $in: listIds }
      });

      return !lists.length;
    };

    this.init = async () => {
      if (await this.shouldInitialize()) {
        return await this.db.insert(defaultLists);
      }

      return null;
    };

    this.appendTail = async (todoId, listId = "active") => {
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
        await this.db.update({ todoId: last.todoId, type: types.todoList }, { $set: { nextId: todoId } });
      }

      return resolvedListRecord;
    };

    this.getTodoListItem = async (todoId, listId = "active") => {
      return await this.db.findOne({
        type: types.todoList,
        listId,
        todoId: todoId
      });
    };

    this.getFirstNode = async (listId = "active") => {
      return await this.db.findOne({
        type: types.todoList,
        listId,
        previousId: null
      });
    };

    this.updateTodoListItem = async ({ todoId, listId = "active", options }) => {
      await this.db.update({ todoId: todoId, type: types.todoList, listId }, { $set: options });
    };

    this.remove = async (todoId, listId = "active") => {
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

      return Object.assign({}, record, {
        previousId: null,
        nextId: null,
        listId: null,
        updateDate: new Date()
      });
    };

    this.archive = async todoId => {
      const record = await this.getTodoListItem(todoId);

      const item = await this.remove(todoId);
      return await this.db.insert(Object.assign({}, item, { listId: "archive" }));
    };

    this.unarchive = async todoId => {
      const record = await this.getTodoListItem(todoId, "archive");

      const removed = this.db.remove({ _id: record._id });
      return await this.appendTail(todoId);
    };

    this.reorder2 = async (todoId, previousId, listId = "active") => {
      const previousRecord = previousId ? await this.getTodoListItem(previousId) : null;

      const nextId = previousRecord && previousRecord.nextId || null;

      const nextRecord = previousId === null ? await this.getFirstNode() : await this.getTodoListItem(nextId);

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
      const previousUpdated = previousRecord ? await this.updateTodoListItem({
        todoId: previousRecord.todoId,
        options: { nextId: newRecord.todoId }
      }) : null;

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

    this.reorder = async (todoId, previousId, listId = "active") => {
      const previousRecord = previousId ? await this.getTodoListItem(previousId) : null;

      const nextId = previousRecord && previousRecord.nextId || null;

      const nextRecord = previousId === null ? await this.getFirstNode() : await this.getTodoListItem(nextId);

      // this is the only thing already so bail
      if (!previousRecord && !nextRecord) {
        return;
      }

      const removedRecord = await this.remove(todoId);

      const newRecord = Object.assign({}, removedRecord, {
        nextId: nextRecord ? nextRecord.todoId : null,
        previousId: previousRecord ? previousRecord.todoId : null,
        listId: "active",
        updateDate: new Date()
      });

      //update previous
      const previousUpdated = previousRecord ? await this.updateTodoListItem({
        todoId: previousRecord.todoId,
        options: { nextId: newRecord.todoId }
      }) : null;

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

    this.buildTodo = (title, priority) => {
      return {
        id: __WEBPACK_IMPORTED_MODULE_2_cuid___default()(),
        type: types.todo,
        title,
        priority,
        createDate: new Date(),
        updateDate: new Date(),
        isComplete: false
      };
    };

    this.create = async (title, priority) => {
      const todo = this.buildTodo(title, priority);
      const record = await this.db.insert(todo);

      this.appendTail(todo.id);
      return record;
    };

    this.update = async (todoId, options) => {
      const updated = await this.db.update({ id: todoId, type: types.todo }, { $set: options });

      return updated;
    };

    this.getAll = async (listId = "active") => {
      const metadata = await this.db.find({ type: types.todoList, listId });

      const ids = metadata.map(m => m.todoId);
      const todoList = await this.db.find({ id: { $in: ids } });

      return { todoList, metadata };
    };

    this.db = getDb(db, inMemory, dbPath);
  }

  // Determines if the init function should be run based on the presence of the default lists


  // Initializes the "datastore" if necessary


  // builds a full todo item from title / priority
}

/* harmony default export */ __webpack_exports__["a"] = (TodoService);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src"))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("nedb-promise");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("cuid");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map