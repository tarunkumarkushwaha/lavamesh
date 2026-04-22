"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
    LayoutDashboard,
    FolderLock,
    Share2,
    ChevronLeft,
    ChevronRight,
    Database
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Foot from "@/components/Foot";
import SaveToHardDriveBtn from "@/components/SaveToHardDriveBtn";
import { useDispatch, useSelector } from "react-redux";
import { hydrateVault, markAsSaved, connectVault, addProposalToQueue } from "@/store/lavaSlice";
import { useSocket } from "@/hooks/useSocket";

export default function BaseLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const dispatch = useDispatch();

    // 1. Redux State
    const { projects, currentProjectId, role, persistence } = useSelector((state) => state.lava);
    const project = projects[currentProjectId];

    // 2. Initial Hydration
    useEffect(() => {
        dispatch(hydrateVault());
    }, [dispatch]);

    // 3. Socket Initialization (Only if a project ID exists)
    const socket = useSocket(currentProjectId);

    // 4. Background Sync Logic
    useEffect(() => {
        if (!socket || !project) return;

        // --- ADMIN LOGIC ---
        if (role === 'admin') {
            // Transfer data to new peers joining the room
            const handlePeerJoin = ({ peerId }) => {
                socket.emit('transfer-initial-data', { peerId, projectData: project });
            };

            socket.on('peer-joined-needs-data', handlePeerJoin);

            // Broadcast local changes if state is "dirty"
            if (persistence?.isDirty) {
                socket.emit("sync-vault-to-peers", {
                    projectId: currentProjectId,
                    data: project
                });
                dispatch(markAsSaved());
            }

            return () => socket.off('peer-joined-needs-data', handlePeerJoin);
        }

        // --- PEER LOGIC ---
        if (role === 'peer') {
            const handleSync = (incomingData) => {
                dispatch(connectVault(incomingData));
            };

            socket.on('sync-vault', handleSync);
            
            // If Peer makes a local change, send it as a proposal
            if (persistence?.isDirty) {
                socket.emit("send-proposal", {
                    projectId: currentProjectId,
                    proposal: project 
                });
                dispatch(markAsSaved());
            }

            return () => socket.off('sync-vault', handleSync);
        }
    }, [socket, project, role, persistence?.isDirty, currentProjectId, dispatch]);

    // 5. Shared Listeners (Proposals)
    useEffect(() => {
        if (!socket) return;
        socket.on('receive-proposal', (proposal) => {
            dispatch(addProposalToQueue(proposal));
        });
        return () => socket.off('receive-proposal');
    }, [socket, dispatch]);

    // Navigation Menu Setup
    const menuItems = [
        { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
        { name: "Mesh Sync", href: "/mesh", icon: <Share2 size={20} /> },
    ];

    if (role === 'admin') {
        menuItems.push({ name: "Local Vault", href: "/vault", icon: <FolderLock size={20} /> });
        menuItems.push({ name: "Lava Insurance", href: "/insurance", icon: <Database size={20} /> });
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />
            <div className="flex">
                <aside
                    className={`hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
                >
                    <div className="flex-1 py-6 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                                        }`}
                                >
                                    <div className={`${isActive ? "text-white" : "group-hover:text-blue-500"}`}>
                                        {item.icon}
                                    </div>
                                    {sidebarOpen && (
                                        <span className="font-medium text-sm whitespace-nowrap animate-in fade-in duration-500">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                        <SaveToHardDriveBtn />
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>
                </aside>

                <main className="flex-1 w-full p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="min-h-[80vh] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            <Foot />
        </div>
    );
}