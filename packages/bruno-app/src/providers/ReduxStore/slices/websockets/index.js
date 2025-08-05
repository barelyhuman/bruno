import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const websocketsSlice = createSlice({
  name: "websockets",
  initialState,
  reducers: {
    wsConnect(state, action) {
      const { itemUid, url } = action.payload;
      state[itemUid] = {
        ...(state[itemUid] || {}),
        url,
        connected: false,
        error: null,
        messages: [],
      };
    },
    wsConnectSuccess(state, action) {
      const { itemUid } = action.payload;
      if (state[itemUid]) {
        state[itemUid].connected = true;
        state[itemUid].error = null;
      }
    },
    wsConnectError(state, action) {
      const { itemUid, error } = action.payload;
      if (state[itemUid]) {
        state[itemUid].connected = false;
        state[itemUid].error = error;
      }
    },
    wsDisconnect(state, action) {
      const { itemUid } = action.payload;
      if (state[itemUid]) {
        state[itemUid].connected = false;
      }
    },
    wsMessageReceived(state, action) {
      const { itemUid, content } = action.payload;
      if (state[itemUid]) {
        state[itemUid].messages = state[itemUid].messages.concat({
          type: "received",
          content: content,
        });
      }
    },
    wsMessageSent(state, action) {
      const { itemUid, content } = action.payload;
      if (state[itemUid]) {
        state[itemUid].messages.push({ type: "sent", content });
      }
    },
    wsSendMessage(state, action) {
      // No-op for state, handled by wsMessageSent
    },
    wsClear(state, action) {
      const { itemUid } = action.payload;
      if (state[itemUid]) {
        state[itemUid].messages = [];
        state[itemUid].error = null;
      }
    },
  },
});

export const {
  wsConnect,
  wsConnectSuccess,
  wsConnectError,
  wsDisconnect,
  wsMessageReceived,
  wsMessageSent,
  wsSendMessage,
  wsClear,
} = websocketsSlice.actions;

export default websocketsSlice.reducer;
