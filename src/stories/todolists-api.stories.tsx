import React, {useEffect, useState} from 'react'
import {todolistAPI, updateTaskType} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then((data) => {
                setState(data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = "My first todolist"
        todolistAPI.createTodolist(title)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ee6aad9-5f7c-47ae-9361-c88822bccba8"
        todolistAPI.deleteTodolist(todolistId)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9ee6aad9-5f7c-47ae-9361-c88822bccba8"
        const title = "My third list"
        todolistAPI.updateTodolist(todolistId, title)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "a293b696-4e14-4e79-9e5d-d09daa7841fb"
        todolistAPI.getTasks(todolistId)
            .then((data) => {
                setState(data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "a293b696-4e14-4e79-9e5d-d09daa7841fb"
        const title = "My first task"
        todolistAPI.createTask(todolistId, title)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "a293b696-4e14-4e79-9e5d-d09daa7841fb"
        const taskId = "b1640dfe-d7b2-430a-bdf5-9dbdb1b66a56"
        todolistAPI.deleteTask(todolistId, taskId)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "a293b696-4e14-4e79-9e5d-d09daa7841fb"
        const taskId = "1c47c229-938a-4cc9-a12d-dda5e98c881b"
        const task: updateTaskType = {
            title: "Hello",
            description: "sdfkjsdfkh",
            status: 12,
            priority: 15,
            startDate: "2.2.2",
            deadline: "3.3.3"
        }
        todolistAPI.updateTask(todolistId, taskId, task)
            .then((data) => {
                setState(data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
