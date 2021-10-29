# Omnibus Adaptation of the RTK TODO MVC app

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

(see code in repo)

# Conclusion 

The metaphor of a `bus+listeners+concurrency strategy` is a robust way to compose applications. Routine race conditions can be addressed with little change to surrounding code. The app can grow in a modular, additive fashion. If sounds or animations were to play on the completion of each todo, it would not involve any change to existing code! This has benefits for

   - Dev-time Readability
   - Run-time Performance and Correctness (race condition-free and appropriate cancelation)
   - Team-level agility
   - XD/UX precision in timing behavior

# Reasons Not To ?
It's often said that event bus apps are hard to debug because - 'you dont know where the event came from'. True, there is a layer of indirection. But we also don't code in assembly language anymore because layers of indirection can be supremely useful.

Using a bus with spies, guards and filters means it's trivially simple to dump all events to the console (or filter them through Redux and use Redux DevTools instead). You can (and I do) open a debugger in the callstack of the event triggerer without knowing where the triggerer is. Sure, there is indirection, and you should not introduce it without considering the pros and cons for your team and project. But if you have timing or resource or race condition issues to solve right now, a bus will have ROI right away. Then the small 7Kb cost for that fix can get amortized across future fixes.

Features like optimistic UI, choices like queueing or blocking, can become more like configuration than architecture - in other words, they can be implemented more cheaply, and changed more readily.

# Comparisons/Prior Art

RxJS operators `mergeMap`, `concatMap`, `switchMap`, and `exhaustMap` solve the problems Omnibus solves. In fact Omnibus is just a syntactic sugar around using them, behind mnemonic names such as `listen`, `listenQueueing`, `listenSwitching` and `listenBlocking`. Also Ember Concurrency called the 4 identical modes by its own names.

To my knowledge, the first-class existence of these 4 concurrency modes is not implemented anywhere in JS outside of Angular/RxJS and EmberJS (via Ember Concurrency). Certainly nowhere in React, or even in the coming React Suspense is there as complete a set of answers to these commonly occuring timing strategies. So React developers particularly can use Omnibus as their on-ramp into these concepts because they will probably not think 'RxJS' or 'Ember' for solutions because those sound 'too big'.

Omnibus takes the concepts, and gives you a minimal 7Kb library to give you all their power in a little teeny package!



