```js
<TodoCard
  onChange={(id, checked) => {
    console.log(`isChecked ${id}: ${checked}`);
  }}
  todoId="One"
  title="Not checked"
/>
```

```js
<TodoCard
  onChange={(id, checked) => {
    console.log(`isChecked ${id}: ${checked}`);
  }}
  todoId="One"
  title="Checked"
  checked
/>
```
