import React from 'react'
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import {TodolistsList} from "../features/TodolistsList/Todolists";
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";

type PropsType = {
    demo?: boolean
}

function App({demo = false, ...props}: PropsType) {
    const status = useAppSelector(state => state.app.status)
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1 style={{'textAlign': 'center'}}>404: Page not found</h1>}/>
                    <Route path={'*'} element={<Navigate to='/404'/>}/>
                </Routes>
                <ErrorSnackbar/>
            </Container>
        </div>
    );
}

export default App;
