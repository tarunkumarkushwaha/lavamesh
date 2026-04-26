export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('lava/') && action.type !== 'lava/hydrateVault') {
    const state = store.getState().lava;
    if (typeof window !== "undefined") {
      localStorage.setItem("lava_vault_data", JSON.stringify(state));
    }
  }
  return result;
};