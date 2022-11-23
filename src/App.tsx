import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {
    AppBar,
    Button,
    Container,
    FormControl,
    FormControlLabel, FormLabel, Grid,
    IconButton, Paper, Radio,
    RadioGroup,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {jsx} from "@emotion/react";

type ObjectType = {
    title: string
    filter: FilterValuesType
    tasks: Array<TasksType>
}
export type TasksType = {
    taskId: string
    title: string
    isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed";

function App() {
    const [todo, setTodo] = useState<Array<ObjectType>>([
        {
            title: "What to learn",
            filter: "all",
            tasks: [
                {taskId: v1(), title: "HTML&CSS", isDone: true},
                {taskId: v1(), title: "JS", isDone: true}
            ],
        },
        {
            title: "What to do",
            filter: "all",
            tasks: [
                {taskId: v1(), title: "HTML&CSS2", isDone: true},
                {taskId: v1(), title: "JS2", isDone: true}
            ],
        }
    ])

    function removeTask(id: string, todolistId: number) {
        setTodo(todo.map((el, index) => index === todolistId ? {
            ...el,
            tasks: el.tasks.filter(t => t.taskId !== id)
        } : el))
    }

    function addTask(title: string, todolistId: number) {
        let newTask: TasksType = {taskId: v1(), title: title, isDone: false};
        setTodo(todo.map((el, index) => index === todolistId ? {...el, tasks: [newTask, ...el.tasks]} : el));
    }

    function changeStatus(id: string, isDone: boolean, todolistId: number) {
        setTodo(todo.map((el, index) => index === todolistId
            ? {...el, tasks: el.tasks.map(t => t.taskId === id ? {...t, isDone: isDone} : t)}
            : el))
    }

    function changeFilter(value: FilterValuesType, todolistId: number) {
        setTodo(todo.map((el, index) => index === todolistId ? {...el, filter: value} : el))
    }

    function removeTodolist(id: number) {
        setTodo(todo.filter((el, index) => index !== id));
    }

    const addTodolist = (title: string) => {
        setTodo([{title: title, filter: "all", tasks: []}, ...todo])
    }
    const changeTaskTitle = (id: string, newTitle: string, todolistId: number) => {
        setTodo(todo.map((el, index) => index === todolistId
            ? {...el, tasks: el.tasks.map(t => t.taskId === id ? {...t, title: newTitle} : t)}
            : el))
    }
    const changeTodolistTitle = (newTitle: string, todolistId: number) => {
        setTodo(todo.map((el, index) => index === todolistId
            ? {...el, title: newTitle}
            : el)
        )
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        TodoList
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container direction="row"
                      justifyContent="center"
                      alignItems="center" style={{padding: "10px"}}>
                    <Grid item><AddItemForm addItem={addTodolist}/></Grid></Grid>
                <Grid container direction="row"
                      justifyContent="center"
                      alignItems="center" spacing={4}>    {
                    todo.map((tl, index) => {
                        let allTodolistTasks = todo[index].tasks;
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === "active") {
                            tasksForTodolist = allTodolistTasks.filter(t => !t.isDone);
                        }
                        if (tl.filter === "completed") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone);
                        }

                        return <Grid item key={index}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolistId={index}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
