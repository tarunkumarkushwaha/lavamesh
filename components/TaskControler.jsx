"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, moveTask } from "@/store/lavaSlice";
import { Plus, ArrowRight, Zap } from "lucide-react";

export default function TaskController({ task, currentColumn, allColumns }) {
    const dispatch = useDispatch();
    const [isAdding, setIsAdding] = useState(false);
    const [content, setContent] = useState("");

    // 1. Handle New Task Creation
    const handleCreate = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const newTask = {
            id: Date.now().toString(), // Local-first unique ID
            content: content,
            priority: "Normal",
            createdAt: new Date().toISOString(),
        };

        dispatch(addTask({ task: newTask, columnId: "todo" }));
        setContent("");
        setIsAdding(false);
    };

    // 2. Handle Task Shifting (Next State)
    const shiftTask = (taskId, sourceCol) => {
        const states = ["todo", "ongoing", "review", "done"];
        const currentIndex = states.indexOf(sourceCol);

        if (currentIndex < states.length - 1) {
            const destCol = states[currentIndex + 1];
            dispatch(moveTask({
                taskId,
                sourceCol,
                destCol,
                newIndex: 0 // Move to top of next column
            }));
        }
    };

    // Render for "Add Task" mode
    if (!task) {
        return (
            <div className="mb-6">
                {isAdding ? (
                    <form onSubmit={handleCreate} className="flex gap-2 animate-in fade-in zoom-in duration-200">
                        <input
                            autoFocus
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What needs to be done?"
                            className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-900 border border-blue-500 rounded-lg outline-none ring-2 ring-blue-500/10"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            Add
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-slate-500">
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <Plus size={16} />
                        </div>
                        Create New Task
                    </button>
                )}
            </div>
        );
    }

    // Render for "Shift Task" mode (used inside table rows)
    return (
        <button
            onClick={() => shiftTask(task.id, currentColumn)}
            disabled={currentColumn === "done"}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${currentColumn === "done"
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
            title="Move to next stage"
        >
            <span className="text-xs font-bold">Advance</span>
            <ArrowRight size={14} />
        </button>
    );
}