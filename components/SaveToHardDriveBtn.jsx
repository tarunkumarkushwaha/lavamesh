"use client"
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { markAsSaved } from "@/store/lavaSlice";

const SaveToHardDriveBtn = () => {
const persistence = useSelector((state) => state.lava?.persistence);

// Use a fallback so the page doesn't crash during the first millisecond of boot-up
const isDirty = persistence?.isDirty || false;
const lastSavedAt = persistence?.lastSavedAt || null;

const project = useSelector((state) => state.lava?.project || {});
    const dispatch = useDispatch();
    const saveProjectToDisk = async (projectData) => {
        try {
            // 1. Open the file picker to save a file
            const handle = await window.showSaveFilePicker({
                suggestedName: 'lavamesh-project.json',
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                }],
            });

            // 2. Create a writable stream
            const writable = await handle.createWritable();

            // 3. Write the Redux project data
            await writable.write(JSON.stringify(projectData, null, 2));

            // 4. Close the file
            await writable.close();

            alert("Vault physical file updated successfully.");
            dispatch(markAsSaved());
        } catch (err) {
            console.error("Save aborted", err);
        }
    };
    return (
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
                {isDirty ? (
                    <>
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-medium text-amber-600">Unsaved Changes</span>
                    </>
                ) : (
                    <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">Synced to Disk</span>
                    </>
                )}
            </div>

            <button
                onClick={() => saveProjectToDisk(project)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${isDirty
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
            >
                <Save size={14} />
                {isDirty ? "Save to Vault" : "Saved"}
            </button>
        </div>
    )
}

export default SaveToHardDriveBtn