"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    CheckCircle2, Plus, ChevronDown,
    Clock,
    AlertCircle,
    Layers,
    TrendingUp,
    Zap,
    User,
    MessageSquare,
    Copy
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import AdminReviewPanel from "./AdminReviewPanel";
import { selectProject } from "@/store/lavaSlice";
import CreateProject from "./CreateProject";

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showProjectPicker, setShowProjectPicker] = useState(false);

    // 1. Pull data safely from Redux
    const { projects, currentProjectId, mesh, userName, proposals } = useSelector((state) => state.lava || {});
    const project = projects?.[currentProjectId];

    // 2. Safe Hook Calls (Never pass undefined properties to hooks)
    const socket = useSocket(project?.id);

    // 3. Keep a fresh reference of the project for the socket to avoid re-rendering
    const projectRef = useRef(project);
    useEffect(() => {
        projectRef.current = project;
    }, [project]);

    // 4. Calculate dynamic stats safely
    const totalTasks = Object.keys(project?.tasks || {}).length;
    const completedTasks = project?.columns?.['done']?.taskIds?.length || 0;
    const todoTasks = project?.columns?.['todo']?.taskIds?.length || 0;
    const ongoingTasks = project?.columns?.['ongoing']?.taskIds?.length || 0;
    const pendingTasks = todoTasks + ongoingTasks;

    const copyInviteCode = () => {
        if (!project?.id) return;
        navigator.clipboard.writeText(project.id);
        alert("Invite Code Copied! Send this to your peer.");
    };

    const handleSwitchProject = (id) => {
        dispatch(selectProject(id));
        setShowProjectPicker(false);
    };

    const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const stats = [
        { label: "Total Tasks", value: totalTasks, icon: <Layers className="text-blue-500" />, color: "bg-blue-500/10" },
        { label: "Pending", value: pendingTasks, icon: <Clock className="text-amber-500" />, color: "bg-amber-500/10" },
        { label: "Completed", value: completedTasks, icon: <CheckCircle2 className="text-emerald-500" />, color: "bg-emerald-500/10" },
        { label: "Active Peers", value: mesh?.peersOnline || 0, icon: <Zap className="text-purple-500" />, color: "bg-purple-500/10" },
    ];

    // 5. Socket Setup
    useEffect(() => {
        if (!socket || !project?.id) return;

        socket.on("connect", () => {
            console.log("Admin Socket Connected. Project ID:", project.id);
        });

        // The listener uses projectRef so it always sends the latest data 
        // WITHOUT needing to re-attach the listener on every Redux change.
        socket.on('peer-joined-needs-data', ({ peerId }) => {
            console.log("Peer", peerId, "joined. Transferring Master Vault...");
            socket.emit('transfer-initial-data', {
                peerId: peerId,
                projectData: projectRef.current
            });
        });

        return () => {
            socket.off('peer-joined-needs-data');
            socket.off('connect');
        };
    }, [socket, project?.id]); // Only re-run if the project ID or socket changes entirely

    // 6. Early Return for empty states
    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-400" />
                <p className="text-slate-500 font-medium">No active project found. Please select or create one.</p>
                <button onClick={() => window.location.href = "/"} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl">Go Home</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Invite Bar */}
            <div className="flex items-center justify-between p-2 pl-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">

                {/* Project Picker */}
                <div className="flex justify-center items-center relative ml-2">
                    <p className=" mr-5">Current project: </p>
                    <button
                        onClick={() => setShowProjectPicker(!showProjectPicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                    >
                        {project.name} <ChevronDown size={16} />
                    </button>

                    {showProjectPicker && (
                        <>
                            {/* Invisible backdrop to close dropdown when clicking outside */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowProjectPicker(false)}></div>
                            <div className="absolute top-12 left-0 w-64 bg-slate-900 border rounded-2xl shadow-xl z-50 p-2 space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 p-2 uppercase">Your Vaults</p>
                                {Object.values(projects || {}).map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSwitchProject(p.id)}
                                        className={`w-full text-left p-3 rounded-xl text-sm ${currentProjectId === p.id ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-800'}`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID</span>
                    <code className="text-[11px] font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        {project.id.slice(0, 6)}...{project.id.slice(-4)}
                    </code>
                    <button
                        onClick={copyInviteCode}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-lg transition-all text-[11px] shadow-sm active:scale-95"
                    >
                        <Copy size={12} /> Copy Invite
                    </button>
                </div>

            </div>

            {!isCreating ?
                <>
                    {/* 1. Header Section with Username & Switcher */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <User size={16} className="text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-600/60">Admin Session</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Welcome back, <span className="text-blue-600">{userName || "Architect"}</span>
                                </h1>


                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Aggregated data from your current project.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                            <TrendingUp size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                Efficiency: {completionRate}%
                            </span>
                        </div>
                    </div>

                    {/* 2. Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:border-blue-500/30 transition-all group">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* 3. Bottom Action Section (FIXED GRID LAYOUT) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Project Health Card (Takes up 2 of 3 columns) */}
                        <div className="lg:col-span-2 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertCircle className="text-blue-500" />
                                <h2 className="text-xl font-semibold">Project Health</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Task Completion</span>
                                        <span className="font-bold">{completionRate}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                            style={{ width: `${completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                    {ongoingTasks > 0
                                        ? `"You have ${ongoingTasks} tasks currently in motion. Focus there to keep the mesh stable."`
                                        : `"All clear. No active tasks are currently in the ongoing stage."`}
                                </p>
                            </div>
                        </div>

                        {/* Stacked Quick Connect Cards (Takes up 1 of 3 columns) */}
                        <div className="flex flex-col gap-6">
                            <div
                                onClick={() => setIsCreating(true)}
                                className="flex-1 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-3 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors text-slate-400 group-hover:text-white">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Create New Project</h3>
                                    <p className="text-xs text-slate-500 mt-1">Initialize a new workspace.</p>
                                </div>
                            </div>

                            {/* <div className="flex-1 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-3 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 transition-colors text-slate-400 group-hover:text-white">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Connect New Vault</h3>
                                    <p className="text-xs text-slate-500 mt-1">Add a local project folder.</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </>
                :
                <CreateProject setIsCreating={setIsCreating} />
            }

            {/* <aside className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-transform duration-500 z-40 ${isReviewOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <AdminReviewPanel onClose={() => setIsReviewOpen(false)} />
            </aside> */}
            {/* Review Proposals Floating Button */}
            {/* <button
                onClick={() => setIsReviewOpen(!isReviewOpen)}
                className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
            >
                <div className="relative">
                    <MessageSquare size={20} />
                    {(proposals?.length || 0) > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {proposals.length}
                        </span>
                    )}
                </div>
                <span className="font-bold text-sm">Review Changes</span>
            </button> */}
        </div>
    );
}