import React, {useState} from 'react';
import { socket } from '../utils/socket-io';
import axios from 'axios';

const JoinBlock = ({onLoggin}) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      alert('Incorrect inputs!')
      return;
    }
    const obj = {
      roomId,
      userName
    }
    setLoading(true);
    await axios.post('http://localhost:3001/rooms', obj);
    onLoggin(obj);
  }

  return (
    <div className='join-block'>
      <input type='text' placeholder='Room ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <input type='text' placeholder='User name' value={userName} onChange={(e) => setUserName(e.target.value)} />
      <button disabled={loading} onClick={() => onEnter()} className='button'>{loading ? 'Entering...' : 'Enter'}</button>
    </div>
  );
}

export default JoinBlock;
