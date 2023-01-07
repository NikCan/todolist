import React, {useEffect, useState} from 'react'
import {
    getTasksType,
    ResponseType,
    TaskType,
    todolistAPI,
    TodolistType,
    updateTaskModelType
} from "../api/todolists-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<TodolistType[]>([])
    useEffect(() => {
        todolistAPI.getTodolists()
            .then((data) => {
                setState(data)
            })
    }, [])
    return <>
        {/*{JSON.stringify(state)}*/}
        {state.map(el => <div>
            {JSON.stringify(el)}
        </div>)}
    </>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<ResponseType<{ item: TodolistType }>>(null)
    const [title, setTitle] = useState<string>('')
    const createNewTodolist = () => {
        todolistAPI.createTodolist(title)
            .then((data) => {
                setState(data)
                setTitle('')
            })
    }
    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder="new title" value={title} onChange={(e) => {
            setTitle(e.currentTarget.value)
        }}/>
        <button onClick={createNewTodolist}>+</button>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<ResponseType>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const deleteTodolist = () => {
        todolistAPI.deleteTodolist(todolistId)
            .then((data) => {
                setState(data)
                setTodolistId('')
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <button onClick={deleteTodolist}>-</button>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<ResponseType>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const updateTodolistTitle = () => {
        todolistAPI.updateTodolist(todolistId, title)
            .then((data) => {
                setState(data)
                setTitle('')
                setTodolistId('')
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <input placeholder="new title" value={title} onChange={(e) => {
            setTitle(e.currentTarget.value)
        }}/>
        <button onClick={updateTodolistTitle}>go</button>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<getTasksType>({error: null, totalCount: 0, items: []})
    const [todolistId, setTodolistId] = useState<string>("")
    const getTasks = () => {
        todolistAPI.getTasks(todolistId)
            .then((data) => {
                setState(data)
                setTodolistId('')
            })
    }
    return <>
        {/*{JSON.stringify(state)}*/}
        <div>error: {state ? state.error : null}</div>
        <div>totalCount: {state ? state.totalCount : null}</div>
        {state ? state.items.map(el => <div>
            {JSON.stringify(el)}
        </div>) : null}
        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <button onClick={getTasks}>get</button>
    </>
}
export const CreateTask = () => {
    const [state, setState] = useState<ResponseType<{ item: TaskType }>>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const createTask = () => {
        todolistAPI.createTask(todolistId, title)
            .then((data) => {
                setState(data)
                setTodolistId('')
                setTitle('')
            })
    }
    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <input placeholder="new title" value={title} onChange={(e) => {
            setTitle(e.currentTarget.value)
        }}/>
        <button onClick={createTask}>+</button>
    </div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<ResponseType>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const deleteTask = () => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then((data) => {
                setState(data)
                setTodolistId('')
                setTaskId('')
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <input placeholder="task id" value={taskId} onChange={(e) => {
            setTaskId(e.currentTarget.value)
        }}/>
        <button onClick={deleteTask}>-</button>
    </div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<ResponseType>(null)
    const [oldTask, setOldTask] = useState<TaskType[]>([])
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const [task, setTask] = useState<updateTaskModelType>({
        title: "",
        description: "",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: ""
    })
    const updateTask = () => {
        todolistAPI.updateTask(todolistId, taskId, task)
            .then((data) => {
                setState(data)
            })
    }
    const getTask = () => {
        todolistAPI.getTasks(todolistId)
            .then((data) => {
                setOldTask(data.items.filter(t => t.id === taskId))
                setTask({
                    title: data.items[0].title,
                    description: data.items[0].description,
                    status: data.items[0].status,
                    priority: data.items[0].priority,
                    startDate: data.items[0].startDate,
                    deadline: data.items[0].deadline
                })
            })
    }
    return <div>

        <input placeholder="todolist id" value={todolistId} onChange={(e) => {
            setTodolistId(e.currentTarget.value)
        }}/>
        <input placeholder="task id" value={taskId} onChange={(e) => {
            setTaskId(e.currentTarget.value)
        }}/>
        <button onClick={getTask}>get task for update</button>
        <div>{JSON.stringify(oldTask[0])}</div>

        <hr/>
        <div><input placeholder="title" value={task.title} onChange={(e) => {
            setTask({...task, title: e.currentTarget.value})
        }}/></div>
        <div><input placeholder="description" value={task.description} onChange={(e) => {
            setTask({...task, description: e.currentTarget.value})
        }}/></div>
        <div><input placeholder="status" value={task.status} onChange={(e) => {
            setTask({...task, status: +e.currentTarget.value})
        }}/></div>
        <div><input placeholder="priority" value={task.priority} onChange={(e) => {
            setTask({...task, priority: +e.currentTarget.value})
        }}/></div>
        <div><input placeholder="startDate" value={task.startDate} onChange={(e) => {
            setTask({...task, startDate: e.currentTarget.value})
        }}/></div>
        <div><input placeholder="deadline" value={task.deadline} onChange={(e) => {
            setTask({...task, deadline: e.currentTarget.value})
        }}/></div>

        <button onClick={updateTask}>go</button>
        <div>{JSON.stringify(state)}</div>
    </div>
}
