import { createSlice } from '@reduxjs/toolkit';
// const loadLocalData = () => {
//   if (typeof window === "undefined") return null;
//   const saved = localStorage.getItem("lava_vault_data");
//   return saved ? JSON.parse(saved) : null;
// };

// const localData = loadLocalData();

const initialState = {
  isHydrated: false,
  role: 'peer',
  vaultConnected: false,
  lastSynced: null,
  project: {
    id: "initial-project",
    name: "New Project",
    columns: {
      'todo': { id: 'todo', title: 'To Do', taskIds: [] },
      'ongoing': { id: 'ongoing', title: 'Ongoing', taskIds: [] },
      'review': { id: 'review', title: 'Under Review', taskIds: [] },
      'done': { id: 'done', title: 'Done', taskIds: [] },
    },
    tasks: {},
  },
  persistence: {
    isDirty: false,
    lastSavedHash: null,
    lastSavedAt: null,
  },
  mesh: { peersOnline: 0, activeConnections: [], syncHealth: 'stable' },
  backup: { googleDriveLinked: false, lastCloudBackup: null, isLavaProof: false }
};

export const lavaSlice = createSlice({
  name: 'lava',
  initialState,
  reducers: {
    hydrateVault: (state) => {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem("lava_vault_data");

      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.isHydrated;
        Object.assign(state, parsed);
      }

      state.isHydrated = true;
    },
    connectVault: (state, action) => {
      state.vaultConnected = true;
      state.role = 'admin';
      state.project = action.payload;
      state.persistence.isDirty = false; // Freshly loaded
      state.persistence.lastSavedHash = JSON.stringify(action.payload);
    },

    addTask: (state, action) => {
      const { task, columnId } = action.payload;
      state.project.tasks[task.id] = task;
      state.project.columns[columnId].taskIds.push(task.id);
      state.lastSynced = new Date().toISOString();
      state.persistence.isDirty = true;
    },

    moveTask: (state, action) => {
      const { taskId, sourceCol, destCol, newIndex } = action.payload;

      const sourceIds = state.project.columns[sourceCol].taskIds;
      sourceIds.splice(sourceIds.indexOf(taskId), 1);

      const destIds = state.project.columns[destCol].taskIds;
      destIds.splice(newIndex, 0, taskId);

      state.lastSynced = new Date().toISOString();
      state.persistence.isDirty = true;
    },

    updateMeshStatus: (state, action) => {
      state.mesh.peersOnline = action.payload.count;
      state.mesh.syncHealth = action.payload.status;
    },

    setCloudSyncStatus: (state, action) => {
      state.backup.lastCloudBackup = action.payload.time;
      state.backup.isLavaProof = true;
    },
    markSavedToDisk: (state) => {
      state.lastSynced = new Date().toISOString();
      state.backup.isLavaProof = true; // Visual proof that data is savd
    },
    markAsSaved: (state) => {
      state.persistence.isDirty = false;
      state.persistence.lastSavedAt = new Date().toISOString();
      state.persistence.lastSavedHash = JSON.stringify(state.project);
    },
  }
});

export const {
  markAsSaved,
  markSavedToDisk,
  hydrateVault,
  connectVault,
  addTask,
  moveTask,
  updateMeshStatus,
  setCloudSyncStatus
} = lavaSlice.actions;

export default lavaSlice.reducer;