
In this repo, we take the synchronous-local-state version of the [RTK Todos Example](), and we insert an API call 'in the middle' of the `addTodo` process. We start at commit b2a2df9 which creates the RTK Query `saveTodoMutation`, and adds a call to it to `AddTodo`. Basically we make this change.

```diff
- addTodo(todoText)
- setTodoText('')
+ saveTodo(todoText).then(() => {
+   addTodo(todoText)
+   setTodoText('')
+ })
```

At this point, we have an `isLoading` field that controls a piece of UI that puts ellipses on the Add Todo button.

```ts
const [saveTodo, { isLoading }] = useSaveTodoMutation()
...
<button type="submit">Add Todo{isLoading ? '...' : ''}</button>
```

But we have race conditions lurking here.

What occurs when the first call to the `saveTodo` mutation takes longer - say 5000 milliseconds, while the second call takes only 3000 milliseconds?
The loading indicator goes away too soon. Furthermore, if the insertion order of todos is of interest, the server could now record an earlier `createdAt` date for the _second_ todo than for the first! You've indavertantly violated causality.

The point is not that RTK Query does something wrong. The point is that often times the correct timing strategy often exists **outside** of whatever library you are using. And it may not even be implemented in any library already in your app (unless you are using Angular). 

Here, RxJS operators have something to offer. And Omnibus lets bus listener handler callbacks return anything that can become an Observable, including a Promise. So without needing to comb the documents for RTK Query for how to serialize requests (if it even does that), you can solve the problem right off the bus. Here is how you do that...

TODO finish explaining when less tired...
