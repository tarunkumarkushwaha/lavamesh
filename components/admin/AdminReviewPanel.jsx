"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { Check, X, MessageSquare, User, CheckCircle2 } from "lucide-react";
import { acceptProposal, rejectProposal } from "@/store/lavaSlice";

export default function AdminReviewPanel({ onClose }) {
  const dispatch = useDispatch();
  // We only need the proposals from the mesh
  const { proposals } = useSelector((state) => state.lava);

  const handleApprove = (proposalId) => {
    // This dispatch updates the state AND sets isDirty: true
    // Our BaseLayout / SocketBridge will handle the actual broadcast
    console.log(proposalId,proposals,"propose")
    dispatch(acceptProposal(proposalId));
  };

  if (proposals.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
        <CheckCircle2 size={40} className="text-slate-300 mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Vault is Synced
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          No pending proposals from the mesh.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MessageSquare size={16} /> Incoming PRs
        </h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg">
          <X size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {proposals.map((pr) => (
          <div 
            key={pr.id} 
            className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-900/50 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User size={12} className="text-blue-600" />
              </div>
              <span className="text-xs font-bold">{pr.sender}</span>
              <span className="text-[9px] text-slate-400 ml-auto">
                {pr.timestamp ? new Date(pr.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
            
            <div className="space-y-1 py-1 border-y border-slate-100 dark:border-slate-800">
              {pr.changes?.map((c, i) => (
                <div key={i} className="text-[10px] text-slate-500 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span>
                  {c.summary || "Manual override requested"}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => handleApprove(pr.id)}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Check size={12} /> Approve Merge
              </button>
              <button 
                onClick={() => dispatch(rejectProposal(pr.id))}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-bold transition-all"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
        <p className="text-[9px] text-slate-400 text-center uppercase font-bold tracking-widest">
          LavaMesh Proposal Protocol v1.0
        </p>
      </div>
    </div>
  );
}