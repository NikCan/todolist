import React, {useEffect} from 'react'
import './App.css';
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from '@mui/material/LinearProgress';
import {useAppDispatch, useAppSelector} from "hooks";
import {TodolistsList} from "features/todolists-list";
import {ErrorSnackbar} from "components";
import {Login, selectIsLoggedIn} from "features/auth";
import {Navigate, Route, Routes} from "react-router-dom";
import {initializeAppTC} from "app/app-reducer";
import {selectIsInitialized, selectStatus} from "app";
import {logoutTC} from "features/auth/auth-reducer";

type PropsType = {
  demo?: boolean
}

function App({demo = false, ...props}: PropsType) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const status = useAppSelector(selectStatus)

    useEffect(() => {
    if (!demo) dispatch(initializeAppTC())
  }, [])
  const onLogoutClickHandler = () => dispatch(logoutTC())

  return (!isInitialized)
    ? <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
    : <div className="App">
      <AppBar position="static">
        <Toolbar style={{'justifyContent': 'space-between'}}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            Todolists
          </Typography>
          {isLoggedIn && <Button color="inherit" onClick={onLogoutClickHandler}>Logout</Button>}
        </Toolbar>
        {status === "loading" && <LinearProgress/>}
      </AppBar>
      <Container fixed style={{ margin: '0' }}>
        <Routes>
          <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
          <Route path={'/login'} element={<Login/>}/>
          <Route path={'/404'} element={<h1 style={{'textAlign': 'center'}}>404: Page not found</h1>}/>
          <Route path={'*'} element={<Navigate to='/404'/>}/>
        </Routes>
        <ErrorSnackbar/>
      </Container>
    </div>
}

export default App;
