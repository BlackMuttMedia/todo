import path from "path";
import Service from "./service";
import Datastore from "nedb-promise";

const listQuery = {
  type: "list",
  id: { $in: ["active", "archive"] }
};

const DEFAULT_PATH = path.join(__dirname, "..", "db", "test.db");

const mockListRecords = [
  {
    listId: "active",
    todoId: "first",
    nextId: "second",
    type: "todoList",
    previousId: null
  },
  {
    listId: "active",
    todoId: "second",
    nextId: "third",
    type: "todoList",
    previousId: "first"
  },
  {
    listId: "active",
    todoId: "third",
    nextId: null,
    type: "todoList",
    previousId: "second"
  }
];

describe("service tests", () => {
  let db;

  beforeEach(async () => {
    db = await new Datastore();
  });

  afterEach(async () => {
    return await db.remove({ $where: () => true });
  });

  it("initializes with data", async () => {
    const initial = await db.find(listQuery);
    expect(initial.length).toEqual(0);

    const service = new Service({ db });
    await service.init();

    const second = await db.find(listQuery);
    expect(second.length).toEqual(2);
  });

  it("updates a todo", async () => {
    const service = new Service({ db });
    service.init();

    const todo = await service.create("First thing");

    const initialRecord = await db.findOne({ type: "todo", id: todo.id });

    expect(initialRecord).toMatchObject({ title: "First thing" });

    const updates = await service.update(todo.id, { title: "UPDATED TITLE" });
    const updatedRecord = await db.findOne({ type: "todo", id: todo.id });

    expect(updatedRecord).toMatchObject({ title: "UPDATED TITLE" });
  });

  it("does not initialize when data present", async () => {
    await db.insert([
      { id: "active", type: "list", title: "Todos" },
      { id: "archive", type: "list", title: "Archive" }
    ]);

    const initial = await db.find(listQuery);
    expect(initial.length).toEqual(2);

    const service = new Service({ db });
    await service.init();
    const second = await db.find(listQuery);
    expect(second.length).toEqual(2);
  });

  it("appends todo records to the tail of the todo list when no records present", async () => {
    const service = new Service({ db });
    await service.init();

    const todo = service.buildTodo("a test record", null);

    const listRecord = await service.appendTail(todo.id);

    const list = await db.find({ type: "todoList" });
    expect(list && list.length).toEqual(1);
    expect(list[0].id).toEqual(todo.todoId);
  });

  it("appends todo records to the tail of the todo list when existing list present", async () => {
    const service = new Service({ db });
    await service.init();
    const records = await db.insert(mockListRecords);

    const todo = service.buildTodo("a test record", null);
    const listRecord = await service.appendTail(todo.id);

    const list = await db.find({ type: "todoList" });
    expect(list && list.length).toEqual(4);

    const third = await db.findOne({ type: "todoList", todoId: "third" });
    const appended = await db.findOne({ type: "todoList", todoId: todo.id });

    expect(appended.previousId).toEqual("third");
    expect(appended.nextId).toEqual(null);
    expect(third.nextId).toEqual(todo.id);
  });

  describe("reordering operations", () => {
    let service;
    let todo;
    let listRecord;

    let getItemLookup = items => {
      return items.reduce(
        (acc, next) => ({
          ...acc,
          [next.todoId]: { next: next.nextId, previous: next.previousId }
        }),
        {}
      );
    };

    beforeEach(async () => {
      service = new Service({ db });
      await service.init();

      todo = service.buildTodo("a test record", null);
      listRecord = await service.appendTail(todo.id);
    });

    it("sets only record if reordered as sole todo", async () => {
      service.reorder(todo.id, null);
      const items = await db.find({ type: "todoList", todoId: todo.id });
      expect(items.length).toEqual(1);
    });

    it("updates sibling records with correct sort order", async () => {
      const records = await db.insert(mockListRecords);
      await service.reorder(todo.id, "second");

      const items = await db.find({ type: "todoList" });
      const testItems = getItemLookup(items);

      expect(testItems).toMatchObject({
        first: { next: "second", previous: null },
        second: { next: todo.id, previous: "first" },
        [todo.id]: { next: "third", previous: "second" },
        third: { next: null, previous: todo.id }
      });

      expect(testItems).toMatchObject({
        first: { next: "second", previous: null },
        second: { next: todo.id, previous: "first" },
        [todo.id]: { next: "third", previous: "second" },
        third: { next: null, previous: todo.id }
      });
    });

    it("sets to last record if previousId is currently last", async () => {
      const records = await db.insert(mockListRecords);
      await service.reorder(todo.id, "third");

      const items = await db.find({ type: "todoList" });
      const testItems = getItemLookup(items);

      expect(testItems).toMatchObject({
        first: { next: "second", previous: null },
        second: { next: "third", previous: "first" },
        [todo.id]: { next: null, previous: "third" },
        third: { next: todo.id, previous: "second" }
      });
    });

    it.skip("sets to first record if previousId is currently null", async () => {
      const records = await db.insert(mockListRecords);
      await service.reorder(todo.id, null);

      const items = await db.find({ type: "todoList" });
      const testItems = getItemLookup(items);

      expect(testItems).toMatchObject({
        [todo.id]: { next: "first", previous: null },
        first: { next: "second", previous: todo.id },
        second: { next: "third", previous: "first" },
        third: { next: null, previous: "second" }
      });
    });

    it("removes an item", async () => {
      const records = await db.insert(mockListRecords);
      const item = await service.remove("second");

      const items = await db.find({ type: "todoList", listId: "active" });

      const testItems = getItemLookup(items);

      expect(testItems).toMatchObject({
        first: { next: "third", previous: null },
        third: { next: null, previous: "first" }
      });
    });

    it("returns removed item", async () => {
      const records = await db.insert(mockListRecords);
      const item = await service.remove("second");

      expect(item).toMatchObject({
        todoId: "second",
        nextId: null,
        previousId: null,
        listId: null
      });
    });

    it("archives an item", async () => {
      const records = await db.insert(mockListRecords);

      const item = await service.archive("second");

      // Again not so nice but running into an async issue I can't see quickly
      const activeItems = await db.find({
        type: "todoList",
        listId: "active"
      });

      const archiveItems = await db.find({
        type: "todoList",
        listId: "archive"
      });

      expect(getItemLookup(activeItems)).toMatchObject({
        first: { next: "third", previous: null },
        third: { next: null, previous: "first" }
      });

      expect(getItemLookup(archiveItems)).toMatchObject({
        second: { next: null, previous: null }
      });
    });

    it.skip("unarchives an item", async () => {
      const records = await db.insert(mockListRecords);

      const archivedItem = await db.insert({
        listId: "archive",
        todoId: "archived",
        type: "todoList",
        previousId: null,
        nextId: null
      });

      const item = await service.unarchive("archived");

      const activeItems = await db.find({
        type: "todoList",
        listId: "active"
      });

      const archivedItems = await db.find({
        type: "todoList",
        listId: "archive"
      });

      expect(archivedItems.length).toEqual(0);

      expect(getItemLookup(activeItems)).toMatchObject({
        first: { next: "second", previous: null },
        second: { next: "third", previous: "first" },
        third: { next: "archived", previous: "second" },
        archived: { next: null, previous: "third" }
      });
    });
  });
});
