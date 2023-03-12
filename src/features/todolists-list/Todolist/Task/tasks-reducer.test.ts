import {
  addTaskTC,
  changeTaskEntityStatusAC,
  fetchTasksTC,
  removeTaskTC,
  tasksReducer,
  TasksStateType,
  updateTaskTC,
} from './tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from "api/todolists-api";
import {addTodolistTC, removeTodolistTC} from "features/todolists-list/todolists-list-reducer";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      }
    ],
    "todolistId2": [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        order: 2,
        addedDate: '',
        description: 'qwerty',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      }
    ]
  };
});

test('correct task should be deleted from correct array', () => {
  const action = removeTaskTC.fulfilled({taskId: "2", todolistId: "todolistId2"}, 'requestId', {
    taskId: "2",
    todolistId: "todolistId2"
  });

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every(t => t.id !== "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
  const newTask: TaskType = {
    title: "juice",
    status: TaskStatuses.New,
    order: 0,
    description: "",
    priority: 0,
    deadline: "",
    startDate: "",
    id: "taskId",
    todoListId: "todolistId2",
    addedDate: "",
    entityStatus: 'idle'
  }
  const action = addTaskTC.fulfilled({
    todolistId: "todolistId2",
    task: newTask
  }, 'requestId', {title: newTask.title, todolistId: newTask.todoListId});

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
  expect(endState["todolistId2"][0].status).toBe(0);
});
test('status of specified task should be changed', () => {
  const apiModel = {
    title: "juice",
    status: TaskStatuses.New,
    description: "",
    priority: 0,
    deadline: "",
    startDate: "",
  }
  const action = updateTaskTC.fulfilled({taskId: "2", apiModel, todolistId: "todolistId2"}, 'requestId', {
    taskId: '2',
    todolistId: 'todolistId2',
    domainModel: apiModel
  });

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].status).toBe(2);
  expect(endState["todolistId2"][1].status).toBe(0);
});
test('title of specified task should be changed', () => {
  const apiModel = {
    title: "yogurt",
    status: TaskStatuses.New,
    description: "",
    priority: 0,
    deadline: "",
    startDate: "",
  }
  const action = updateTaskTC.fulfilled({
    taskId: "2",
    apiModel,
    todolistId: "todolistId2"
  }, 'requestId', {taskId: "2", domainModel: apiModel, todolistId: "todolistId2"});

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});
test('new array should be added when new todolist is added', () => {
  const todolist = {
    id: "newTodolist",
    title: "new todo",
    addedDate: "",
    order: 0
  }
  const action = addTodolistTC.fulfilled({todolist}, 'requestId', 'new todo');

  const endState = tasksReducer(startState, action)


  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
})

test('property with todolistId should be deleted', () => {
  const action = removeTodolistTC.fulfilled({todolistId: "todolistId2"}, 'requestId', "todolistId2");

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
})

test('tasks should be added for todolist', () => {
  const action = fetchTasksTC.fulfilled({
    tasks: startState['todolistId1'],
    todolistId: "todolistId1"
  }, 'requestId', 'todolistId1');

  const endState = tasksReducer({
    'todolistId1': [],
    'todolistId2': []
  }, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
})

test('entityStatus of specified task should be changed', () => {
  const action = changeTaskEntityStatusAC({taskId: "2", todolistId: "todolistId2", entityStatus: 'loading'});

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].entityStatus).toBe('idle')
  expect(endState["todolistId2"][1].entityStatus).toBe('loading')
})