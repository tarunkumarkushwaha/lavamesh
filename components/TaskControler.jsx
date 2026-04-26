"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, moveTask, stageChange } from "@/store/lavaSlice";
import { Plus, ArrowDown } from "lucide-react";
import TaskModal from "./Modal";

export default function TaskController({ task, currentColumn }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role } = useSelector((state) => state.lava);

  const handleConfirmAdd = ({ content, priority, name, assignee }) => {
    const newTask = {
      id: `task-${Date.now()}`,
      content: content,
      priority: priority,
      name: name,
      createdAt: new Date().toISOString(),
      assignee: assignee,
    };

    dispatch(addTask({ task: newTask, columnId: "todo" }));
  };

  const shiftTask = (taskId, sourceCol, taskContent) => {
    const states = ["todo", "ongoing", "review", "done"];
    const currentIndex = states.indexOf(sourceCol);

    if (currentIndex < states.length - 1) {
      const destCol = states[currentIndex + 1];

      dispatch(moveTask({ taskId, sourceCol, destCol, newIndex: 0 }));

      if (role === "peer") {
        dispatch(
          stageChange({
            type: "MOVE_TASK",
            data: { taskId, sourceCol, destCol },
            summary: `Advanced: ${taskContent} to ${destCol.toUpperCase()}`,
          }),
        );
      }
    }
  };

  if (!task) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          New Task
        </button>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAdd}
        />
      </>
    );
  }

  // "SHIFT MODE" - Show the Advance button (used in tables)
  return (
    <button
      onClick={() => shiftTask(task.id, currentColumn)}
      disabled={currentColumn === "done"}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
        currentColumn === "done"
          ? "text-slate-300 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
          : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-tight">
        Advance
      </span>
      <ArrowDown size={14} />
    </button>
  );
}
