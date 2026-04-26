import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setRole, createProject } from "@/store/lavaSlice";
import { ArrowRight, FolderPlus } from "lucide-react";

const CreateProject = ({ setIsCreating }) => {
    const dispatch = useDispatch();
    const { userName } = useSelector((state) => state.lava);
    const [projectName, setProjectName] = useState("");

    const handleCreateFinal = () => {
        if (!projectName.trim()) return;

        const projectId = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;

        // Set the identity and role only when the project is ready
        dispatch(setRole({ role: 'admin', user: userName }));

        dispatch(createProject({
            name: projectName,
            id: projectId,
            userName: userName
        }));
        setIsCreating(false)
    };
    return (
        <div className="max-w-md mx-auto space-y-6 animate-in zoom-in-95">
            <div className="flex justify-center items-center flex-col">
                <FolderPlus size={40} className="mx-auto text-blue-600" />
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <p className="text-sm text-slate-500">Give your local project a name.</p>
            </div>
            <input
                autoFocus
                type="text"
                placeholder="Project Name (e.g. Boring Marketing)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-6 py-4 text-center text-lg font-semibold bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-2xl outline-none"
            />
            <div className="flex gap-3">
                <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-4 cursor-pointer bg-slate-800 font-bold rounded-2xl"
                >
                    Back
                </button>
                <button
                    onClick={handleCreateFinal}
                    disabled={!projectName.trim()}
                    className="flex-2 py-4 bg-blue-600 cursor-pointer text-white font-bold rounded-2xl hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    Launch Dashboard <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )
}

export default CreateProject