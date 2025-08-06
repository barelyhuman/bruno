import {
  wsClear,
  wsConnect,
  wsConnectError,
  wsConnectSuccess,
  wsDisconnect,
  wsMessageReceived,
  wsMessageSent,
  wsSendMessage,
} from "./index.js";
import { callIpc } from "utils/common/ipc";

export const connectWebSocket = ({ itemUid, url }) => (dispatch) => {
  dispatch(wsConnect({ itemUid, url }));
  const headers = {
    "Connection": "upgrade",
    "Upgrade": "websocket",
  };
  return new Promise((resolve, reject) => {
    return callIpc("renderer:ws-connect", {
      itemUid,
      url,
      options: { headers },
    })
      .then(() => {
        dispatch(wsConnectSuccess({ itemUid }));
        return resolve();
      })
      .catch((error) => {
        dispatch(wsConnectError({ itemUid, error: error.message }));
        return reject(error);
      });
  });
};

export const disconnectWebSocket = ({ itemUid }) => (dispatch) => {
  dispatch(wsDisconnect({ itemUid }));
  return callIpc("renderer:ws-disconnect", { itemUid })
    .then(() => dispatch(wsDisconnect({ itemUid })))
    .catch((error) =>
      dispatch(wsConnectError({ itemUid, error: error.message }))
    );
};

export const sendWebSocketMessage = ({ itemUid, message }) => (dispatch) => {
  dispatch(wsSendMessage({ itemUid, message }));
  return callIpc("renderer:ws-send", { itemUid, message })
    .then(() => dispatch(wsMessageSent({ itemUid, content: message })))
    .catch((error) =>
      dispatch(wsConnectError({ itemUid, error: error.message }))
    );
};

export const clearWebSocketLog = ({ itemUid }) => (dispatch) => {
  dispatch(wsClear({ itemUid }));
};
