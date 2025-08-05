import { useEffect } from 'react';
import {
  showPreferences,
  updateCookies,
  updatePreferences,
  updateSystemProxyEnvVariables
} from 'providers/ReduxStore/slices/app';
import {
  brunoConfigUpdateEvent,
  collectionAddDirectoryEvent,
  collectionAddFileEvent,
  collectionChangeFileEvent,
  collectionRenamedEvent,
  collectionUnlinkDirectoryEvent,
  collectionUnlinkEnvFileEvent,
  collectionUnlinkFileEvent,
  processEnvUpdateEvent,
  runFolderEvent,
  runRequestEvent,
  scriptEnvironmentUpdateEvent
} from 'providers/ReduxStore/slices/collections';
import {
  collectionAddEnvFileEvent,
  hydrateCollectionWithUiStateSnapshot,
  openCollectionEvent
} from 'providers/ReduxStore/slices/collections/actions';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { isElectron } from 'utils/common/platform';
import {
  globalEnvironmentsUpdateEvent,
  updateGlobalEnvironments
} from 'providers/ReduxStore/slices/global-environments';
import {
  collectionAddOauth2CredentialsByUrl,
  updateCollectionLoadingState
} from 'providers/ReduxStore/slices/collections/index';
import { addLog } from 'providers/ReduxStore/slices/logs';
import {
  wsClear,
  wsConnectError,
  wsConnectSuccess,
  wsDisconnect,
  wsMessageReceived,
  wsMessageSent
} from 'providers/ReduxStore/slices/websockets';

const useIpcEvents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isElectron()) {
      return () => {};
    }

    const { ipcRenderer } = window;

    const _collectionTreeUpdated = (type, val) => {
      if (window.__IS_DEV__) {
        console.log(type);
        console.log(val);
      }
      if (type === 'addDir') {
        dispatch(
          collectionAddDirectoryEvent({
            dir: val
          })
        );
      }
      if (type === 'addFile') {
        dispatch(
          collectionAddFileEvent({
            file: val
          })
        );
      }
      if (type === 'change') {
        dispatch(
          collectionChangeFileEvent({
            file: val
          })
        );
      }
      if (type === 'unlink') {
        setTimeout(() => {
          dispatch(
            collectionUnlinkFileEvent({
              file: val
            })
          );
        }, 100);
      }
      if (type === 'unlinkDir') {
        dispatch(
          collectionUnlinkDirectoryEvent({
            directory: val
          })
        );
      }
      if (type === 'addEnvironmentFile') {
        dispatch(collectionAddEnvFileEvent(val));
      }
      if (type === 'unlinkEnvironmentFile') {
        dispatch(collectionUnlinkEnvFileEvent(val));
      }
    };

    ipcRenderer.invoke('renderer:ready');

    const removeCollectionTreeUpdateListener = ipcRenderer.on('main:collection-tree-updated', _collectionTreeUpdated);

    const removeOpenCollectionListener = ipcRenderer.on('main:collection-opened', (pathname, uid, brunoConfig) => {
      dispatch(openCollectionEvent(uid, pathname, brunoConfig));
    });

    const removeCollectionAlreadyOpenedListener = ipcRenderer.on('main:collection-already-opened', (pathname) => {
      toast.success('Collection is already opened');
    });

    const removeDisplayErrorListener = ipcRenderer.on('main:display-error', (error) => {
      if (typeof error === 'string') {
        return toast.error(error || 'Something went wrong!');
      }
      if (typeof error === 'object') {
        return toast.error(error.message || 'Something went wrong!');
      }
    });

    const removeScriptEnvUpdateListener = ipcRenderer.on('main:script-environment-update', (val) => {
      dispatch(scriptEnvironmentUpdateEvent(val));
    });

    const removeGlobalEnvironmentVariablesUpdateListener = ipcRenderer.on(
      'main:global-environment-variables-update',
      (val) => {
        dispatch(globalEnvironmentsUpdateEvent(val));
      }
    );

    const removeCollectionRenamedListener = ipcRenderer.on('main:collection-renamed', (val) => {
      dispatch(collectionRenamedEvent(val));
    });

    const removeRunFolderEventListener = ipcRenderer.on('main:run-folder-event', (val) => {
      dispatch(runFolderEvent(val));
    });

    const removeRunRequestEventListener = ipcRenderer.on('main:run-request-event', (val) => {
      dispatch(runRequestEvent(val));
    });

    const removeProcessEnvUpdatesListener = ipcRenderer.on('main:process-env-update', (val) => {
      dispatch(processEnvUpdateEvent(val));
    });

    const removeConsoleLogListener = ipcRenderer.on('main:console-log', (val) => {
      console[val.type](...val.args);
      dispatch(
        addLog({
          type: val.type,
          args: val.args,
          timestamp: new Date().toISOString()
        })
      );
    });

    const removeConfigUpdatesListener = ipcRenderer.on('main:bruno-config-update', (val) =>
      dispatch(brunoConfigUpdateEvent(val))
    );

    const removeShowPreferencesListener = ipcRenderer.on('main:open-preferences', () => {
      dispatch(showPreferences(true));
    });

    const removePreferencesUpdatesListener = ipcRenderer.on('main:load-preferences', (val) => {
      dispatch(updatePreferences(val));
    });

    const removeSystemProxyEnvUpdatesListener = ipcRenderer.on('main:load-system-proxy-env', (val) => {
      dispatch(updateSystemProxyEnvVariables(val));
    });

    const removeCookieUpdateListener = ipcRenderer.on('main:cookies-update', (val) => {
      dispatch(updateCookies(val));
    });

    const removeGlobalEnvironmentsUpdatesListener = ipcRenderer.on('main:load-global-environments', (val) => {
      dispatch(updateGlobalEnvironments(val));
    });

    const removeSnapshotHydrationListener = ipcRenderer.on('main:hydrate-app-with-ui-state-snapshot', (val) => {
      dispatch(hydrateCollectionWithUiStateSnapshot(val));
    });

    const removeCollectionOauth2CredentialsUpdatesListener = ipcRenderer.on('main:credentials-update', (val) => {
      const payload = {
        ...val,
        itemUid: val.itemUid || null,
        folderUid: val.folderUid || null,
        credentialsId: val.credentialsId || 'credentials'
      };
      dispatch(collectionAddOauth2CredentialsByUrl(payload));
    });

    const removeCollectionLoadingStateListener = ipcRenderer.on('main:collection-loading-state-updated', (val) => {
      dispatch(updateCollectionLoadingState(val));
    });

    // WebSocket IPC listeners
    const removeWsConnectListener = ipcRenderer.on('main:ws-connect', (payload) => {
      dispatch(wsConnectSuccess(payload));
    });

    const removeWsOpenListener = ipcRenderer.on('main:ws-open', (payload) => {
      console.log('connection open');
    });

    const removeWsDisconnectListener = ipcRenderer.on('main:ws-disconnect', (payload) => {
      dispatch(wsDisconnect(payload));
    });

    const removeWsErrorListener = ipcRenderer.on('main:ws-error', (payload) => {
      dispatch(wsConnectError(payload));
    });

    const removeWsMessageListener = ipcRenderer.on('main:ws-message', (payload) => {
      const _payload = {
        ...payload,
        content: Buffer.from(payload.data).toString()
      };
      dispatch(wsMessageReceived(_payload));
    });

    const removeWsMessageSentListener = ipcRenderer.on('main:ws-message-sent', (payload) => {
      dispatch(wsMessageSent(payload));
    });

    const removeWsClearListener = ipcRenderer.on('main:ws-clear', (payload) => {
      dispatch(wsClear(payload));
    });

    return () => {
      removeCollectionTreeUpdateListener();
      removeOpenCollectionListener();
      removeCollectionAlreadyOpenedListener();
      removeDisplayErrorListener();
      removeScriptEnvUpdateListener();
      removeGlobalEnvironmentVariablesUpdateListener();
      removeCollectionRenamedListener();
      removeRunFolderEventListener();
      removeRunRequestEventListener();
      removeProcessEnvUpdatesListener();
      removeConsoleLogListener();
      removeConfigUpdatesListener();
      removeShowPreferencesListener();
      removePreferencesUpdatesListener();
      removeCookieUpdateListener();
      removeSystemProxyEnvUpdatesListener();
      removeGlobalEnvironmentsUpdatesListener();
      removeSnapshotHydrationListener();
      removeCollectionOauth2CredentialsUpdatesListener();
      removeCollectionLoadingStateListener();
      removeWsConnectListener();
      removeWsDisconnectListener();
      removeWsErrorListener();
      removeWsMessageListener();
      removeWsMessageSentListener();
      removeWsClearListener();
      removeWsOpenListener();
    };
  }, [isElectron]);
};

export default useIpcEvents;
