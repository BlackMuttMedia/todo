```js
<TodoListContainer
  skipApi={true}
  items={[
    { todoId: "one", title: "One" },
    { todoId: "two", title: "Two" },
    { todoId: "three", title: "Three" },
    { todoId: "four", title: "Four" },
    { todoId: "five", title: "Five" },
    { todoId: "six", title: "Six" },
    { todoId: "seven", title: "Seven" },
    { todoId: "eight", title: "Eight" },
    { todoId: "nine", title: "Nine" }
  ]}
>
  {(items, actions) => <TodoList items={items} actions={actions} />}
</TodoListContainer>
```
