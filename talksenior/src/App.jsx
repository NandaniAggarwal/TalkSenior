import './App.css'
import { Button } from '@chakra-ui/react'
import { Route,Switch } from 'react-router-dom/cjs/react-router-dom'
import Homepage from './Pages/Homepage'
import Chatpage from './Pages/Chatpage'
import "./index.css"
import React, { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
    <div className='App'>
    <Switch>
      <Route exact path="/" component={Homepage} />
        <Route path="/chats">
          {user ? <Chatpage /> : <Redirect to="/" />}
        </Route><Route path="/chats">
          {user ? <Chatpage /> : <Redirect to="/" />}
        </Route>
    </Switch>
    </div>
    </>
  )
}

export default App
