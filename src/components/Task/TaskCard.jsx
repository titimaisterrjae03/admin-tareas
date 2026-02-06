import { Calendar, Clock, MoreVertical, Edit2, Trash2, CheckCircle, PlayCircle, Clock as ClockIcon } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Button } from '../UI/Button';
import { STATUS_LABELS } from '../../utils/constants';

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const [showMenu, setShowMenu] = useState(false);

    const getPriorityBorder = (date) => {
        const days = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
        if (days < 2) return 'border-l-4 border-l-red-500';
        if (days < 5) return 'border-l-4 border-l-amber-500';
        return 'border-l-4 border-l-emerald-500';
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return <CheckCircle size={14} className="text-emerald-400" />;
        if (status === 'in_progress') return <PlayCircle size={14} className="text-blue-400" />;
        return <ClockIcon size={14} className="text-slate-400" />;
    };

    return (
        <div className={`bg-slate-900 rounded-xl p-4 shadow-sm relative group ${getPriorityBorder(task.due_date)}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-2 pl-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider truncate max-w-[70%]">
                    {task.subject}
                </span>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1">
                                <button
                                    onClick={() => { setShowMenu(false); onEdit(task); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                >
                                    <Edit2 size={14} /> Editar
                                </button>

                                <div className="border-t border-slate-700 my-1"></div>

                                <div className="px-4 py-1 text-xs text-slate-500 font-semibold uppercase">Cambiar Estatus</div>
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setShowMenu(false); onStatusChange(task.id, key); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center gap-2 ${task.status === key ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}
                                    >
                                        {task.status === key && <CheckCircle size={12} />}
                                        {label}
                                    </button>
                                ))}

                                <div className="border-t border-slate-700 my-1"></div>

                                <button
                                    onClick={() => { setShowMenu(false); onDelete(task.id); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Eliminar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="pl-2">
                <h3 className="font-bold text-lg text-slate-100 mb-1 leading-tight">{task.topic}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{task.description}</p>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-800/50">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(task.due_date).toLocaleDateString()}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700`}>
                        {getStatusIcon(task.status)}
                        {STATUS_LABELS[task.status] || task.status}
                    </span>
                </div>
            </div>
        </div>
    );
}
