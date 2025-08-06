import { IconPlugConnected, IconPlugConnectedX } from '@tabler/icons';
import { disconnectWebSocket } from 'providers/ReduxStore/slices/websockets/actions';
import toast from 'react-hot-toast';
import { useTheme } from 'providers/Theme';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const WSConnectionStateButton = ({ item }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isWS = item.type === 'ws-request';
  if (!isWS) return;
  const wsState = useSelector((state) => state.websockets[item.uid] ?? {});

  if (!wsState.connected) {
    return <IconPlugConnected color={theme.requestTabPanel.ws.connect} strokeWidth={1.5} size={22} />;
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        dispatch(disconnectWebSocket({ itemUid: item.uid })).then(()=>{
          toast.success("Websocket Disconnected")
        });
      }}
    >
      <IconPlugConnectedX color={theme.requestTabPanel.ws.connectionFailed} strokeWidth={1.5} size={22} />
    </span>
  );
};
