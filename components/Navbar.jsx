"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Database, Share2, LayoutDashboard } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navbarLinks = [
        { href: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/vault", label: "Local Vault", icon: <Database size={18} /> },
        { href: "/mesh", label: "Mesh Sync", icon: <Share2 size={18} /> },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isAdmin = true;

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2"
                : "bg-transparent py-5"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <div className="relative w-9 h-9">
                        <Image
                            src="/lavameshlogo.png"
                            alt="LavaMesh"
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        LavaMesh
                    </span>
                </div>
                {/* fix it later */}
                {/* <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200 dark:border-slate-800">
          {navbarLinks.map(({ href, label }) => (
            <Link 
              key={href} 
              href={href}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === href 
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div> */}

                <div className="hidden md:flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search project..."
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-40 focus:w-56"
                        />
                    </div>

                    {!isAdmin ? <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
                        Join Mesh
                    </button> :
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
                            Connect Vault
                        </button>}
                </div>

                <button
                    className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            <div className={`
        absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 md:hidden transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
      `}>
                <div className="p-6 flex flex-col gap-4">
                    {navbarLinks.map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-lg ${pathname === href ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-slate-600 dark:text-slate-400"
                                }`}
                        >
                            {icon}
                            {label}
                        </Link>
                    ))}
                    <button className="mt-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">
                        Connect Local Vault
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;