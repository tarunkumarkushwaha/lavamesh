"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipboardList, Ghost, User, Zap, Activity } from "lucide-react";
import ProposalButton from "./ProposalButton";
import { useSocket } from "@/hooks/useSocket";
import { connectVault } from "@/store/lavaSlice";

export default function PeerDashboard() {
  // 1. Pull data from Redux
  const { projects, currentProjectId, myPendingChanges, userName } = useSelector((state) => state.lava || {});
  const project = projects?.[currentProjectId];
  // const socket = useSocket(currentProjectId);


  // Calculate local sync progress (visual only)
  const pendingCount = myPendingChanges?.length || 0;
  const syncProgress = Math.min(pendingCount * 20, 100);
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("sync-vault", (incomingProjectData) => {
  //     console.log("Data Received from Admin:", incomingProjectData);
  //     // CRITICAL: Ensure this matches your reducer name
  //     dispatch(connectVault(incomingProjectData));
  //   });

  //   return () => socket.off("sync-vault");
  // }, [socket, dispatch]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-slate-500 animate-pulse">Syncing with Vault: {currentProjectId}...</p>
      </div>
    );
  }

  const todoIds = project?.columns?.['todo']?.taskIds || [];
  const ongoingIds = project?.columns?.['ongoing']?.taskIds || [];
  const assignedIds = [...todoIds, ...ongoingIds];
  const myTasks = assignedIds.map(id => project.tasks[id]).filter(Boolean);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-indigo-500 fill-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500/80">Peer Mesh Active</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Greetings, <span className="text-indigo-600">{userName || "Operator"}</span>
          </h1>
          <p className="text-slate-500">You are currently synced with the Admin Vault.</p>
        </div>
        <ProposalButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 2. Allotted Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <ClipboardList size={20} className="text-indigo-500" />
              Your Workspace
            </h3>
            <span className="text-xs font-medium text-slate-400">{myTasks.length} Tasks Available</span>
          </div>

          <div className="space-y-3">
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <div
                  key={task.id}
                  className="group p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center shadow-sm hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-slate-300'}`} />
                    <div>
                      <p className="font-semibold group-hover:text-indigo-600 transition-colors">{task.content}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Active
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center text-center opacity-40">
                <Ghost size={48} className="mb-4 text-slate-300" />
                <p className="text-sm font-medium">The vault is currently empty.</p>
                <p className="text-xs text-slate-400 mt-1">Check back when the Admin adds new objectives.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Mesh Intelligence / Sync Stats */}
        <div className="space-y-6">
          <div className="p-6 bg-linear-to-b from-indigo-500/5 to-transparent border border-indigo-500/10 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-indigo-500" />
              <h4 className="font-bold text-sm uppercase tracking-tighter text-slate-700 dark:text-slate-300">Mesh Intelligence</h4>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">Staged Changes</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                    {pendingCount}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">
                  {pendingCount > 0
                    ? `You have ${pendingCount} local updates not yet merged into the master vault. Push your proposal to sync.`
                    : "Your local environment is currently perfectly in sync with the Admin vault."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status Card */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">P2P Status</p>
              <p className="text-sm text-emerald-600 font-medium">Stable Connection</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}