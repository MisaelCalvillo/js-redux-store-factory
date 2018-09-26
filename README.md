# Vanilla Javascript Redux Store Factory

This repo is intended to make a Redux Store Factory just with plain vanilla Javascript.

### Create a Store

The first step is to create a Factory that encapsulates the state and a way to get it. 

```javascript

function createStore() {

  let state

  const getState = () => state

  return {
    getState
  }
}

const store = createStore();

```

### Listen for changes

We also need a good way to know if there have been changes on our store.

```javascript

function createStore() {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();


```

### The reducer function

Add a new reducer to be used in the store.

```javascript

function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}


function createStore() {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  return {
    getState,
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();


```

### Add a dispatch method

Add a way to run all the listeners in the store.

```javascript
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}


function createStore() {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }
  
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe
  }
}

const store = createStore();

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

unsubscribe();

```

### Put it all together

You now at this point can play in the console with this code !!! 👩🏽‍💻 👨🏽‍💻 

```javascript


// Library code
function createStore(reducer) {

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

// App code
function todos(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([ action.todo ])
  }

  return state;
}

const store = createStore(todos);

store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0, 
    name: 'Lear Redux',
    complete: false,
  }
})


const unsubscribe = store.subscribe(() => {
  console.log('The store changed. ')
})

// unsubscribe(); // Do not unsubscribe yet

```

### Add 'REMOVE_TODO' and 'TOGGLE_TODO' actions

```javascript
// App code
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([ action.todo ])
    case 'REMOVE_TODO':
      return state.filter( (todo) => todo.id !== action.id)
    case 'TOGGLE_TODO': 
      return state.map( (todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete: !todo.complete}))
    default: 
      return state
  }
}
```

### Add another reducer

We now can track our goals as well as our todos, but our store doesn't have a mean to accept two reducers, we will see that in the next section... ⏭

```javascript
function goals(state = [], action) {
  switch (action.type) {
    case 'ADD_GOAL': 
      return state.concat([ action.goal ])
    case 'REMOVE_GOAL':
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}
```

### Add a 'root reducer' to combine several reducers

With this reducer called `app` we can now combine many reducers in our store.

```javascript
function app(state = {}, action){
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

const store = createStore(app);

```

You can test this code in the console and user out example actions... 🖥 

```javascript
store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Walk the dog',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 1,
    name: 'Wash the car',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 2,
    name: 'Go to the gym',
    complete: true,
  }
})

store.dispatch({
  type: 'REMOVE_TODO',
  id: 1
})

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
})

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 0,
    name: 'Learn Redux'
  }
})

store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 1,
    name: 'Lose 20 pounds'
  }
})

store.dispatch({
  type: 'REMOVE_GOAL',
  id: 0
})
```

### Good practice for actions

Use variables instead of just strings to identify typos easier.

```javascript

// Action variables instead of just string, because strings are prone to lots of errors
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'


store.dispatch({
  type: ADD_TODO,
  todo: {
    id: 0, 
    name: 'Lear Redux',
    complete: false,
  }
})

// App code
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([ action.todo ])
    case REMOVE_TODO:
      return state.filter( (todo) => todo.id !== action.id)
    case TOGGLE_TODO: 
      return state.map( (todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete: !todo.complete}))
    default: 
      return state
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL: 
      return state.concat([ action.goal ])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state
  }
}
```

### Action creators

Add functions that abstract the creation of actions in our code. 

```javascript
// Action creators

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}

store.dispatch(addTodoAction({
  id: 1,
  name: 'Wash the car',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 2,
  name: 'Go to the gym',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

// store.dispatch({
//   type: ADD_TODO,
//   todo: {
//     id: 3, 
//     name: 'Lear Redux',
//     complete: false,
//   }
// })

// // Transforms into this

// store.dispatch(addTodoAction({
//   id: 0, 
//   name: 'Lear Redux',
//   complete: false,
// }))

```

## Add some UI to our store 🖼

Crete a new `index.html` file and add a script tag inside with our entire code.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Udacity Todo Goals</title>
</head>
<body>
  <script type="text/javascript">
      // ... store code goes here 
  </script>
</body>
</html>
```

### Inputs

Create the UI inputs to interact with our store

```html
  <div>
    <h1>Todos List</h1>
    <input type="text" id="todoInput" placeholder="Add a todo">
    <button id="todoButton">Save Todo</button>
  </div>
  <div>
    <h1>Goals List</h1>
    <input type="text" id="goalsInput" placeholder="Add a goal">
    <button id="goalsButton">Save goal</button>
  </div>
```

### Dispatch new items

Add items to our store trough the UI of our App

```javascript
     function generateId() {
      return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    }
  
    function addTodo() {
      const input = document.getElementById('todo')
      const name = input.value
      input.value = ''

      store.dispatch(addTodoAction({
        name,
        complete: false,
        id: generateId()
      }))
    }

    function addGoal() {
      const input = document.getElementById('goal')
      const name = input.value
      input.value = ''

      store.dispatch(addGoalAction({
        name,
        id: generateId()
      }))
    }

    document.getElementById('todoBtn').addEventListener('click', addTodo)
    document.getElementById('goalBtn').addEventListener('click', addGoal)
```

### Update the UI

Add UI elements depending on the changes made to the store's state.

```html
    <ul id="goals"></ul>

    <ul id="todos"></ul>
```

```javascript

    store.subscribe(() => {
        const { goals, todos } = store.getState()

        document.getElementById('goals').innerHTML = ''
        document.getElementById('todos').innerHTML = ''

        goals.forEach(addGoalToDOM)
        todos.forEach(addTodoToDOM)
    })


    function addTodoToDOM(todo) {
      const node = document.createElement('li')
      const text = document.createTextNode(todo.name)
      node.appendChild(text)
      node.style.textDecoration = todo.complete ? 'line-through' : 'none'
      node.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id))
      })

      document.getElementById('todos').appendChild(node);

    }

    function addGoalToDOM(goal) {
      const node = document.createElement('li')
      const text = document.createTextNode(goal.name)
      node.appendChild(text)

      document.getElementById('goals').append(node)
    }

```

### Remove items through the UI

Use exclusivelly the UI to remove items from our store state.

```javascript

    function createRemoveButton(onClick) {
      const removeBtn = document.createElement('button')
      removeBtn.innerHTML = 'X'
      removeBtn.addEventListener('click', onClick)
      return removeBtn
    }

    function addTodoToDOM(todo) {
      const node = document.createElement('li')
      const text = document.createTextNode(todo.name)
      const removeBtn = createRemoveButton(() => {
        store.dispatch(removeTodoAction(todo.id))
      })
      node.appendChild(text)
      node.appendChild(removeBtn)
      node.style.textDecoration = todo.complete ? 'line-through' : 'none'
      node.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id))
      })

      document.getElementById('todos').appendChild(node);

    }

    function addGoalToDOM(goal) {
      const node = document.createElement('li')
      const text = document.createTextNode(goal.name)
      const removeBtn = createRemoveButton(() => {
        store.dispatch(removeGoalAction(goal.id))
      })
      node.appendChild(text)
      node.appendChild(removeBtn)

      document.getElementById('goals').append(node)
    }
```

### Use Redux library

Now you have created your own implementation of Redux, it is time to use the real Redux library. 

```javascript
    const store = Redux.createStore(Redux.combineReducers({
      todos,
      goals
    }));
```

The above code can substitute all the code writen in our `createStore` function and in our `app` reducer.

```javascript
    // Library code
    function createStore(reducer) {

    let state
    let listeners = []

    const getState = () => state

    const subscribe = (listener) => {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter((l) => l !== listener)
      }
    }

    const dispatch = (action) => {
      state = reducer(state, action)
      listeners.forEach((listener) => listener())
    }

    return {
      getState,
      subscribe,
      dispatch
    }
    }

  function app(state = {}, action){
    return {
      todos: todos(state.todos, action),
      goals: goals(state.goals, action)
    }
  }
```

### Implement a Middleware 

Use a Middleware to intercept the actions and execute logic based on them. 

```javascript
    function checkAndDispatch(store, action) {
      if (
        action.type === ADD_TODO &&
        action.todo.name.toLowerCase().includes('bitcoin')
      ) {
        return alert("Nope. That's a bad idea.")
      }
      if (
        action.type === ADD_GOAL &&
        action.goal.name.toLowerCase().includes('bitcoin')
      ) {
        return alert("Nope. That's a bad idea.")
      }

      return store.dispatch(action)
    }


      checkAndDispatch(store, addTodoAction({
        name,
        complete: false,
        id: generateId()
      }))
```