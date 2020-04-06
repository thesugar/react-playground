import React, { useState } from 'react'
import { Task } from './Types'
import './App.css'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'

const initialState: Task[] = [
    {
        id: 2,
        title: '型システムの理解',
        done: false
    },
    {
        id: 1,
        title: 'TypeScriptの勉強',
        done: true
    }
]

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialState)

    return (
        <React.Fragment>
            <TaskInput tasks={tasks} setTasks={setTasks} />
            <TaskList tasks={tasks} setTasks={setTasks} />
        </React.Fragment>
    )
}

export default App