import {addTodolistTC, todolistsReducer} from './todolists-list-reducer';
import {tasksReducer} from './Todolist/Task';
import {TasksStateType} from "./Todolist/Task/types";
import {TodolistDomainType} from "./types";

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];
  const todolist = {id: "todolistId", title: "new todolist", order: 1, addedDate: ''}
  const action = addTodolistTC.fulfilled({todolist}, 'requestId', todolist.title);

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
