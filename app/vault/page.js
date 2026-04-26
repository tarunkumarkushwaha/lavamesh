"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { moveTask, deleteTask } from "@/store/lavaSlice";
import {
  MoreHorizontal,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  ClipboardList,
  Search,
  FolderOpen,
  Trash2,
} from "lucide-react";
import TaskController from "@/components/TaskControler";

export default function LocalVault() {
  const dispatch = useDispatch();
  const { projects, currentProjectId, role } = useSelector(
    (state) => state.lava,
  );
  const project = projects[currentProjectId];
  const columns = project?.columns || {};
  const tasks = project?.tasks || {};
  const hasTasks = Object.keys(tasks).length > 0;

  if (!hasTasks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full">
          <FolderOpen size={48} className="text-slate-400" />
        </div>
        <div className="max-w-sm">
          <h2 className="text-xl font-bold">Your Vault is Empty</h2>
          <p className="text-slate-500 mt-2">
            No local tasks found. Create your first task to begin managing your
            project.
          </p>
        </div>
        <TaskController />
      </div>
    );
  }

  const columnOrder = ["todo", "ongoing", "review", "done"];

  const getColumnIcon = (id) => {
    switch (id) {
      case "todo":
        return <ClipboardList size={18} className="text-slate-400" />;
      case "ongoing":
        return <Clock size={18} className="text-blue-500" />;
      case "review":
        return <ArrowRightLeft size={18} className="text-amber-500" />;
      case "done":
        return <CheckCircle size={18} className="text-emerald-500" />;
      default:
        return null;
    }
  };

  const handleDelete = (taskId, colId, taskContent) => {
    // Local UI update
    dispatch(deleteTask({ taskId, columnId: colId }));

    // Stage change if Peer
    if (role === "peer") {
      dispatch(
        stageChange({
          type: "DELETE_TASK",
          data: { taskId, columnId: colId },
          summary: `Deleted task: ${taskContent}`,
        }),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Local Vault</h1>
          <p className="text-sm text-slate-500">
            Manage tasks and project state directly from your local directory.
          </p>
        </div>
        {role == "admin" && <TaskController />}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Filter tasks..."
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {columnOrder.map((colId) => {
          const column = columns[colId];
          const columnTasks = column?.taskIds?.map((id) => tasks[id]) || [];

          return (
            <div
              key={colId}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getColumnIcon(colId)}
                  <h2 className="font-semibold text-slate-700 dark:text-slate-200">
                    {column?.title}
                  </h2>
                  <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900">
                    <tr>
                      <th className="px-6 py-3 font-medium">Task Name</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Priority</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                      <th className="px-6 py-3 font-medium">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">
                            {task.name}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                            {task.content}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${
                                task.priority === "High"
                                  ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                              }`}
                            >
                              {task.priority || "Normal"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <TaskController
                                task={task}
                                currentColumn={colId}
                              />

                              {/* 2. Status Dropdown */}
                              <select
                                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                                value={colId}
                                onChange={(e) => {
                                  const destCol = e.target.value;
                                  if (destCol === colId) return;

                                  // Stage for Peer first
                                  // if (role === "peer") {
                                  //   dispatch(
                                  //     stageChange({
                                  //       type: "MOVE_TASK",
                                  //       data: {
                                  //         taskId: task.id,
                                  //         sourceCol: colId,
                                  //         destCol,
                                  //       },
                                  //       summary: `Moved ${task.content} to ${columns[destCol].title}`,
                                  //     }),
                                  //   );
                                  // }

                                  dispatch(
                                    moveTask({
                                      taskId: task.id,
                                      sourceCol: colId,
                                      destCol: destCol,
                                      newIndex: 0,
                                    }),
                                  );
                                }}
                              >
                                {columnOrder.map((id) => (
                                  <option key={id} value={id}>
                                    {columns[id].title}
                                  </option>
                                ))}
                              </select>

                              <button
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Task"
                                onClick={() =>
                                  handleDelete(task.id, colId, task.content)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                            {task?.assignee}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-slate-400 italic"
                        >
                          No tasks found in this section.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
