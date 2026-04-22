"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, ClipboardList } from 'lucide-react';
import { createPortal } from "react-dom";

const TaskModal = ({ isOpen, onClose, onConfirm }) => {
    const [content, setContent] = useState('');
    const [name, setname] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [assignee, setAssignee] = useState('');
    const modalRef = useRef(null);

    const handleConfirm = () => {
        if (!content.trim()) return;
        onConfirm({ name, content, priority, assignee });
        setContent('');
        setname("")
        setAssignee("")
        setPriority('Normal');
        onClose();
    };

    const onEnterPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

            <div
                ref={modalRef}
                className="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-2xl border p-6 z-10"
            >
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>

                    <div
                        ref={modalRef}
                        className="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-in zoom-in-95 duration-200"
                    >
                        <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <ClipboardList size={24} />
                            </div>
                            <h1 className='text-xl font-bold'>Create New Task</h1>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    placeholder="task name"
                                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Description</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={content}
                                    onKeyDown={onEnterPress}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={assignee}
                                    onKeyDown={onEnterPress}
                                    onChange={(e) => setAssignee(e.target.value)}
                                    placeholder="set Assignee"
                                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Level</label>
                                <div className="flex gap-2 mt-1">
                                    {['Low', 'Normal', 'High'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${priority === p
                                                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800'
                                                : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                className="flex-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                onClick={handleConfirm}
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TaskModal;


