import {
  addTodolistTC,
  changeTodolistTitleTC,
  removeTodolistTC,
  todolistsReducer,
  todolistsActions
} from './todolists-list-reducer';
import {v1} from 'uuid';
import {FilterValuesType, TodolistDomainType} from "./types";
import {TodolistType} from "api/types";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', order: 1, addedDate: ''},
    {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', order: 1, addedDate: ''},
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({todolistId: todolistId1}, 'requestId', todolistId1))

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
  const newTodolist: TodolistType = {id: todolistId1, title: "New todolists-list", order: 1, addedDate: ''}

  const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist: newTodolist}, 'requestId', 'New TodoList'))

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe("New todolists-list");
  expect(endState[0].filter).toBe("all");
});

test('correct todolist should change its name', () => {
  let newTodolistTitle = "New todolists-list";

  const action = changeTodolistTitleTC.fulfilled({
    id: todolistId2,
    title: newTodolistTitle
  }, 'requestId', {id: todolistId2, title: newTodolistTitle});

  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = "completed";

  const action = todolistsActions.changeTodolistFilterAC({id: todolistId2, filter: newFilter});

  const endState = todolistsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

test('correct entity status of todolist should be changed', () => {
  const action = todolistsActions.changeTodolistEntityStatusAC({id: todolistId2, status: 'loading'});

  const endState = todolistsReducer(startState, action);

  expect(endState[0].entityStatus).toBe('idle');
  expect(endState[1].entityStatus).toBe('loading');
});
