import { clearWebSocketLog, connectWebSocket, disconnectWebSocket, sendWebSocketMessage } from 'providers/ReduxStore/slices/websockets/actions';
import React, { useState } from 'react';
import StyledWrapper from './WebSocketRequestPane/StyledWrapper';
import { useDispatch, useSelector } from 'react-redux';


const formatMessageType = (d)=>{
  return [
    d.at(0).toUpperCase(),
    d.slice(1).toLowerCase()
  ].join("")
}

// TODO:(reaper) redesign
const WebSocketRequestPane = ({ itemUid }) => {
  const dispatch = useDispatch();
  const wsState = useSelector(state => state.websockets[itemUid] ?? {});
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const msg = message.trim()
    if (!msg) return
    dispatch(sendWebSocketMessage({ itemUid, message: msg }))
    setMessage('');
  };

  const handleClear = () => {
    dispatch(clearWebSocketLog({ itemUid: itemUid }));
  };

  return (
    <StyledWrapper className="w-full">
      <div className="ws-controls">
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type message..."
            disabled={!wsState.connected}
            className="ws-input flex-1"
          />
          <div className="flex flex-1">
            <button
              onClick={handleSend}
              disabled={!wsState.connected || !message.trim()}
              className="btn-add-param py-2 px-3 text-link select-none"
            >
              Send &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-10">
        <div className="ws-label">Messages</div>
        <button onClick={handleClear} className="btn-add-param py-2 px-3 text-link select-none">Clear Log</button>
      </div>
      <div className="ws-messages">
        <ul>
          {(wsState.messages || []).map((msg, idx) => (
            <li
              key={idx}
              className={`ws-message ${msg.type}`}
            >
              <span className="!text-neutral-400">[{formatMessageType(msg.type)}]</span>
              <span>{msg.content}</span>
            </li>
          ))}
        </ul>
        {wsState.error && (
          <div className="ws-error">
            Error: {wsState.error}
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default WebSocketRequestPane;
