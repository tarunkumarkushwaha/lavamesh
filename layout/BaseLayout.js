"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
    LayoutDashboard,
    FolderLock,
    Share2,
    Settings,
    ChevronLeft,
    ChevronRight,
    Database
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Foot from "@/components/Foot";
import SaveToHardDriveBtn from "@/components/SaveToHardDriveBtn";
import { useDispatch } from "react-redux";
import { hydrateVault } from "@/store/lavaSlice";

export default function BaseLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hydrateVault());
    }, []);

    const isAdmin = true;

    const menuItems = [
        { name: "Dashboard", href: "/", icon: <LayoutDashboard /> },
        { name: "Mesh Sync", href: "/mesh", icon: <Share2 /> },
    ];

    if (isAdmin) {
        menuItems.push({ name: "Local Vault", href: "/vault", icon: <FolderLock /> });
        menuItems.push({ name: "Lava Insurance", href: "/insurance", icon: <Database /> });
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />
            <div className="flex">
                <aside
                    className={`hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                        }`}
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