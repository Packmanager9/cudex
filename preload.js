const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    exportJSON: (originalData, fileName) => {
        ipcRenderer.send('export-json', { originalData, fileName });
    },
    getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'), // Invoke a method from the main process
});
