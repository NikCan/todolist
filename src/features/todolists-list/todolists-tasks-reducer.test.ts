import {addTodolistTC, TodolistDomainType, todolistsReducer} from './todolists-list-reducer';
import {tasksReducer, TasksStateType} from './Todolist/Task/tasks-reducer';

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
