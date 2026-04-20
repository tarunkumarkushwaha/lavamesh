"use client"
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Save, FolderOpen } from "lucide-react";
import { markAsSaved, connectVault } from "@/store/lavaSlice";

const SaveToHardDriveBtn = () => {
    const persistence = useSelector((state) => state.lava?.persistence);
    const isDirty = persistence?.isDirty || false;
    const lastSavedAt = persistence?.lastSavedAt || null;

    const currentProjectId = useSelector(state => state.lava.currentProjectId);
    const project = useSelector(state => state.lava.projects[currentProjectId]);

    // console.log(project?.name,"project i nsave")

    const tasks = project?.tasks || {};
    const hasTasks = Object.keys(tasks).length > 0;
    const dispatch = useDispatch();
    const saveProjectToDisk = async (projectData) => {
        try {
            // 1. Open the file picker to save a file
            const handle = await window.showSaveFilePicker({
                suggestedName: `${project?.name} lavamesh-project.json`,
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

    const loadProjectFromDisk = async () => {
        try {
            // 1. Open the file picker
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                }],
                multiple: false // We only need one project file
            });

            // 2. Get the file object
            const file = await handle.getFile();

            // 3. Read the text content
            const content = await file.text();

            // 4. Parse JSON
            const projectData = JSON.parse(content);

            // 5. Validation: Ensure the structure matches your Redux project slice
            if (projectData.columns && projectData.tasks) {
                dispatch(connectVault(projectData));
                alert("Vault loaded successfully from disk.");
            } else {
                throw new Error("Invalid Vault file structure.");
            }

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Failed to load vault:", err);
                alert("Error loading file. Make sure it is a valid LavaMesh JSON.");
            }
        }
    };

    if (!project) return null;

    // console.log(lastSavedAt, "saved time")

    return (
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {hasTasks ? <><div className="flex items-center gap-2">
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
                </button></> :
                <button
                    onClick={loadProjectFromDisk}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
                >
                    <FolderOpen size={16} />
                    Open Vault File
                </button>
            }
        </div>
    )
}

export default SaveToHardDriveBtn