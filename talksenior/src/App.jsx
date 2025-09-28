import './App.css'
import { Redirect } from 'react-router-dom/cjs/react-router-dom'
import { Button } from '@chakra-ui/react'
import { Route,Switch } from 'react-router-dom/cjs/react-router-dom'
import Homepage from './Pages/Homepage'
import Chatpage from './Pages/Chatpage'
import "./index.css"
import React, { useState, useEffect } from "react";
import { ChatState } from './Context/ChatProvider';

function App() {
  const { user } = ChatState(); // Context se user lo

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route 
          path="/chats" 
          render={() => (user ? <Chatpage /> : <Redirect to="/" />)} 
        />
      </Switch>
    </div>
  );
}
export default App;