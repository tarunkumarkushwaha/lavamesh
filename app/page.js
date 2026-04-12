"use client";
import React from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  TrendingUp,
  Zap
} from "lucide-react";

export default function Home() {
const { project, mesh } = useSelector((state) => state.lava || {});

  // Logic to aggregate stats (placeholder logic for now)
  const stats = [
    {
      label: "Total Tasks",
      value: Object.keys(project.tasks).length,
      icon: <Layers className="text-blue-500" />,
      color: "bg-blue-500/10",
    },
    {
      label: "Pending",
      value: project.columns['todo'].taskIds.length + project.columns['ongoing'].taskIds.length,
      icon: <Clock className="text-amber-500" />,
      color: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: project.columns['done'].taskIds.length,
      icon: <CheckCircle2 className="text-emerald-500" />,
      color: "bg-emerald-500/10",
    },
    {
      label: "Active Peers",
      value: mesh.peersOnline,
      icon: <Zap className="text-purple-500" />,
      color: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Aggregated intelligence from your local mesh.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
          <TrendingUp size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Efficiency: 88%
          </span>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:border-blue-500/30 transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* 3. Bottom Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Health Card */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-blue-500" />
            <h2 className="text-xl font-semibold">Project Health</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Task Completion</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              "You have 4 pending tasks in Ongoing. Might want to focus there before nuking more billionaire pockets."
            </p>
          </div>
        </div>

        {/* Quick Connect Card */}
        <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-500/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <Zap className="text-slate-400 group-hover:text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Connect New Vault</h3>
            <p className="text-sm text-slate-500">Add a local project folder to sync.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
