// "use client"
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('lava/')) {
    const state = store.getState().lava;
    if (typeof window !== "undefined") {
      localStorage.setItem("lava_vault_data", JSON.stringify(state));
    }
    console.log("Local Vault Auto-Saved");
  }

  return result;
};