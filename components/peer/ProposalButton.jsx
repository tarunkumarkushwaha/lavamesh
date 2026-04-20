"use client";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Clock } from 'lucide-react';
import { clearPendingChanges } from '@/store/lavaSlice';
import { useSocket } from "@/hooks/useSocket";

export default function ProposalButton() {
  const dispatch = useDispatch();
  const { myPendingChanges, role, userName, project } = useSelector((state) => state.lava);

  if (role !== 'peer') return null;
  const socket = useSocket(project.id);

  const handlePushProposal = () => {
    if (myPendingChanges.length > 0 && socket) {
      socket.emit('send-proposal', {
        projectId: project.id,
        proposal: {
          sender: userName,
          changes: myPendingChanges,
          timestamp: new Date()
        }
      });
      dispatch(clearPendingChanges());
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <div className="flex items-center gap-2 px-3">
        <Clock size={16} className="text-amber-500" />
        <span className="text-xs font-bold text-slate-600">
          {myPendingChanges.length} Pending Changes
        </span>
      </div>

      <button
        onClick={handlePushProposal}
        disabled={myPendingChanges.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${myPendingChanges.length > 0
          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
      >
        <Send size={14} />
        Push Proposal
      </button>
    </div>
  );
}