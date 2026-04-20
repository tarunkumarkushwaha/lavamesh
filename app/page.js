"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRole } from "@/store/lavaSlice";
import { ShieldAlert, Users, Box, UserCircle } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import PeerDashboard from "@/components/peer/PeerDashboard";
import CreateProject from "@/components/admin/CreateProject";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [joinCode, setJoinCode] = useState(""); // New state for Admin Setup
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const { userName: savedName, role, isHydrated } = useSelector((state) => state.lava);


  // 3. Sync local state once hydration is complete
  useEffect(() => {
    if (isHydrated && savedName) {
      setUserName(savedName);
    }
  }, [isHydrated, savedName]);

  const handleAdminSetup = () => {
    if (!userName.trim()) {
      setError(true);
      return;
    }
    dispatch(setRole({ role: 'admin', user: userName }));
    setIsCreating(true);
  };

  const handleResetIdentity = () => {
    setUserName("");
    dispatch(setRole({ role: 'unselected', user: '' }));
  };

  // const handleAdminSetup = () => {
  //   if (!userName.trim()) {
  //     setError(true);
  //     return;
  //   }
  //   setIsCreating(true); // Show project naming screen
  // };

  const handleJoinPeer = () => {
    if (!userName.trim() || !joinCode.trim()) {
      setError(!userName.trim());
      return;
    }
    dispatch(setRole({ role: 'peer', user: userName }));
  };

  if (!isHydrated) return <div className="p-10 text-center font-mono">Waking up the mesh...</div>;

  if (role === "admin") return <AdminDashboard />;
  if (role === "peer") return <PeerDashboard />;

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-3xl w-full text-center space-y-8">

        <div className="space-y-4">
          <div className="inline-flex p-4 bg-blue-600/10 rounded-3xl">
            <Box size={48} className="text-blue-600" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase">LavaMesh</h1>
        </div>

        {!isCreating ? (
          // STEP 1: Choose Role
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <div className="max-w-md mx-auto space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <UserCircle size={14} /> Establish Identity
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full px-6 py-4 text-center text-lg font-semibold bg-white dark:bg-slate-900 border-2 rounded-2xl outline-none transition-all ${error ? "border-red-500 animate-shake" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
              />
              {savedName && (
                <button
                  onClick={handleResetIdentity}
                  className="px-4 text-xs font-bold text-red-500 underline"
                >
                  Change
                </button>
              )}
              <button
                onClick={handleAdminSetup}
                className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
              >
                Continue as {userName || "Architect"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div
                onClick={handleAdminSetup}
                className={`p-8 rounded-3xl border-2 text-left transition-all cursor-pointer group ${userName ? "border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" : "opacity-50 grayscale cursor-not-allowed"
                  }`}
              >
                <ShieldAlert className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-bold">Start as Admin</h3>
                <p className="text-sm text-slate-500 mt-2">Initialize a new secure vault.</p>
              </div>

              <div className={`p-8 rounded-3xl border-2 text-left transition-all bg-white dark:bg-slate-900 ${userName ? "border-slate-200 dark:border-slate-800" : "opacity-50"}`}>
                <Users className="text-indigo-600 mb-4" size={32} />
                <h3 className="text-xl font-bold">Join Project</h3>
                <div className="mt-4 flex gap-2">
                  <input
                    disabled={!userName}
                    type="text"
                    placeholder="Join Code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none"
                  />
                  <button onClick={handleJoinPeer} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">Join</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CreateProject setIsCreating={setIsCreating} />
        )
        }
      </div>
    </div>
  );
}