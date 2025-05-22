import { useState } from 'react'
import './App.css'
import { Button } from '@chakra-ui/react'
import { Route,Switch } from 'react-router-dom/cjs/react-router-dom'
import Homepage from './Pages/Homepage'
import Chatpage from './Pages/Chatpage'

function App() {
  return (
    <>
    <div className='App'>
    <Switch>
    <Route path="/" component={Homepage} exact/>
    <Route path="/chats" component={Chatpage} />
    </Switch>
    </div>
    </>
  )
}

export default App
