import { clearWebSocketLog, connectWebSocket, disconnectWebSocket, sendWebSocketMessage } from 'providers/ReduxStore/slices/websockets/actions';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// TODO:(reaper) redesign
const WebSocketRequestPane = ({  itemUid, request }) => {
  const dispatch = useDispatch();
  const wsState = useSelector(state => state.websockets[itemUid] );
  const [message, setMessage] = useState('');

  const handleConnect = () => {
    dispatch(connectWebSocket({itemUid,url:request.url}))
  };

  const handleDisconnect = () => {
    dispatch(disconnectWebSocket({ itemUid:itemUid }))
  };

  const handleSend = () => {
    const msg = message.trim()
    if (!msg)return 

    dispatch(sendWebSocketMessage({itemUid,message:msg}))
    setMessage('');
  };

  const handleClear = () => {
    dispatch(clearWebSocketLog({ itemUid: itemUid }));
  };

  return (
    <div >
      <div >
        <button onClick={handleConnect} disabled={wsState.connected}>Connect</button>
        <button onClick={handleDisconnect} disabled={!wsState.connected}>Disconnect</button>
        <button onClick={handleClear}>Clear Log</button>
      </div>
      <div >
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type message..."
          disabled={!wsState.connected}
        />
        <button onClick={handleSend} disabled={!wsState.connected || !message.trim()}>Send</button>
      </div>
      <div >
        <h4>Messages</h4>
        <ul>
          {(wsState.messages || []).map((msg, idx) => (
            <li key={idx} className={msg.type === 'sent' ? 'sent' : 'received'}>
              <span>[{msg.type}]</span> {msg.content}
            </li>
          ))}
        </ul>
        {wsState.error && <div>Error: {wsState.error}</div>}
      </div>
    </div>
  );
};

export default WebSocketRequestPane;
