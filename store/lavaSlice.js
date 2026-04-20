import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isHydrated: false,
  userName: '',
  role: 'unselected',
  currentProjectId: null,
  vaultConnected: false,
  lastSynced: null,
  myPendingChanges: [],
  isPeerMode: true,
  proposals: [],
  // This represents the ACTIVE project data for the UI
  projects: {}, 
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
    setRole: (state, action) => {
      state.role = action.payload.role;
      state.userName = action.payload.user;
    },

    // --- PROJECT MANAGEMENT ---
    createProject: (state, action) => {
      const { name, id, userName } = action.payload;
      const newProject = {
        id: id,
        name: name,
        tasks: {},
        columns: {
          'todo': { id: 'todo', title: 'To Do', taskIds: [] },
          'ongoing': { id: 'ongoing', title: 'Ongoing', taskIds: [] },
          'review': { id: 'review', title: 'Under Review', taskIds: [] },
          'done': { id: 'done', title: 'Done', taskIds: [] },
        },
        columnOrder: ['todo', 'ongoing', 'review', 'done'],
      };

      state.projects[id] = newProject;
      state.currentProjectId = id;
      state.role = 'admin';
      state.userName = userName;
      state.persistence.isDirty = true;
    },

    connectVault: (state, action) => {
      const incomingProject = action.payload;
      state.projects[incomingProject.id] = incomingProject;
      state.currentProjectId = incomingProject.id;
      state.vaultConnected = true;
      state.persistence.isDirty = false;
      state.persistence.lastSavedHash = JSON.stringify(incomingProject);
    },

    selectProject: (state, action) => {
    state.currentProjectId = action.payload;
},

    // --- TASK MANIPULATION (Dictionary Aware) ---
    addTask: (state, action) => {
      const { task, columnId } = action.payload;
      const project = state.projects[state.currentProjectId];
      
      if (project) {
        project.tasks[task.id] = task;
        project.columns[columnId].taskIds.push(task.id);
        state.lastSynced = new Date().toISOString();
        state.persistence.isDirty = true;
      }
    },

    moveTask: (state, action) => {
      const { taskId, sourceCol, destCol, newIndex } = action.payload;
      const project = state.projects[state.currentProjectId];

      if (project) {
        const sourceIds = project.columns[sourceCol].taskIds;
        const taskIdx = sourceIds.indexOf(taskId);
        if (taskIdx > -1) sourceIds.splice(taskIdx, 1);

        const destIds = project.columns[destCol].taskIds;
        destIds.splice(newIndex, 0, taskId);

        state.lastSynced = new Date().toISOString();
        state.persistence.isDirty = true;
      }
    },

    // --- PROPOSALS & MESH ---
    stageChange: (state, action) => {
      state.myPendingChanges.push({
        id: Date.now(),
        type: action.payload.type,
        payload: action.payload.data,
        summary: action.payload.summary
      });
    },

    clearPendingChanges: (state) => {
      state.myPendingChanges = [];
    },

    addProposalToQueue: (state, action) => {
      state.proposals.push(action.payload);
    },

    rejectProposal: (state, action) => {
      state.proposals = state.proposals.filter(p => p.id !== action.payload);
    },

    acceptProposal: (state, action) => {
      const proposalId = action.payload;
      const proposal = state.proposals.find(p => p.id === proposalId);
      const project = state.projects[state.currentProjectId];

      if (proposal && project) {
        proposal.changes.forEach(change => {
          if (change.type === 'MOVE_TASK') {
            const { taskId, sourceCol, destCol } = change.data;
            project.columns[sourceCol].taskIds = project.columns[sourceCol].taskIds.filter(id => id !== taskId);
            project.columns[destCol].taskIds.push(taskId);
          }
          // Add other types (ADD_TASK, etc) here following the same pattern
        });

        state.proposals = state.proposals.filter(p => p.id !== proposalId);
        state.persistence.isDirty = true;
      }
    },

    // --- SYSTEM & PERSISTENCE ---
    hydrateVault: (state) => {
      if (typeof window === "undefined") return;
      const saved = localStorage.getItem("lava_vault_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // We manually pick keys to avoid overwriting runtime flags like isHydrated
          state.projects = parsed.projects || {};
          state.userName = parsed.userName || '';
          state.currentProjectId = parsed.currentProjectId || null;
        } catch (e) {
          console.error("LavaMesh: Hydration Failed", e);
        }
      }
      state.isHydrated = true;
    },

    markAsSaved: (state) => {
      state.persistence.isDirty = false;
      state.persistence.lastSavedAt = new Date().toISOString();
      const currentProject = state.projects[state.currentProjectId];
      if (currentProject) {
        state.persistence.lastSavedHash = JSON.stringify(currentProject);
      }
    },

    updateMeshStatus: (state, action) => {
      state.mesh.peersOnline = action.payload.count;
      state.mesh.syncHealth = action.payload.status;
    }
  }
});

export const {
  stageChange,
  clearPendingChanges,
  setRole,
  createProject,
  markAsSaved,
  hydrateVault,
  connectVault,
  addTask,
  moveTask,
  updateMeshStatus,
  addProposalToQueue, 
  rejectProposal, 
  acceptProposal,
  selectProject
} = lavaSlice.actions;

export default lavaSlice.reducer;