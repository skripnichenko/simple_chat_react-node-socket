import React, { useState } from 'react'
import { socket } from '../utils/socket-io';

export const Chat = ({ users, messages, userName, roomId, setMessages }) => {
    const [messageValue, setMessageValue] = useState();

    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            text: messageValue,
            roomId
        });
        setMessages({
            userName,
            text: messageValue,
        })
        setMessageValue('');
    }

    return (
        <div className='chat'>
            <div className='chat_left'>
            <div style={{marginBottom: 0}} className='chat_left_amount'>Room: {roomId}</div>
            <hr />
                <div className='chat_left_amount'>Online ({users.length}): </div>
                {users.map(el => {
                    return <div className='chat_left_user'>
                        {el}
                    </div>
                })}
            </div>
            <div className='chat_right'>
                {messages.map((el, ind) => {
                    return <div key={ind} className='message_wrapper'>
                        <div className='message_text'>
                            {el.text}
                        </div>
                        <div className='message_who'>
                            {el.userName}
                        </div>
                    </div>
                })}
                <div className='message_input_wrapper'>
                    <hr />
                    <textarea
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                    />
                    <div onClick={() => onSendMessage()} className='message_send'>
                        Send
                    </div>
                </div>
            </div>
        </div>
    )
}
