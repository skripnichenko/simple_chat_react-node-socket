import axios from 'axios';
import React, { useReducer, useEffect } from 'react';
import './App.css';
import { Chat } from './components/Chat';
import JoinBlock from './components/JoinBlock';
import reducer from './reducers/reducer';
import { socket } from './utils/socket-io';


const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  })

  const onLoggin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    })
    console.log(obj);
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`http://localhost:3001/rooms/${obj.roomId}`);
    console.log(data)
    setUsers(data.users);
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  const setMessages = message => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    })
  }

  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', setMessages)
  }, [])



  return (
    <div className="App">
      {!state.joined ? <JoinBlock onLoggin={onLoggin} /> : <Chat {...state} setMessages={setMessages} />}
    </div>
  );
}

export default App;
