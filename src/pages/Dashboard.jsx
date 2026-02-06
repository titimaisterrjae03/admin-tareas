import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Modal } from '../components/UI/Modal';
import { TaskForm } from '../components/Task/TaskForm';
import { Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        // setLoading(true); // Don't full reload on refresh, just data update
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('due_date', { ascending: true });

        if (error) console.error('Error fetching tasks:', error);
        else setTasks(data || []);
        setLoading(false);
    }

    const handleTaskCreated = () => {
        setIsModalOpen(false);
        fetchTasks();
    };

    const getPriorityColor = (date) => {
        const days = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
        if (days < 2) return 'text-red-400';
        if (days < 5) return 'text-amber-400';
        return 'text-emerald-400';
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Mis Tareas</h2>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> <span className="hidden md:inline">Nueva Tarea</span><span className="md:hidden">Nueva</span>
                </Button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Tarea">
                <TaskForm onSuccess={handleTaskCreated} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div></div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                    <p>No tienes tareas pendientes.</p>
                    <Button variant="ghost" className="mt-2 text-emerald-400 hover:text-emerald-300">Crear primera tarea</Button>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map(task => (
                        <Card key={task.id} className="hover:border-emerald-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">{task.subject}</span>
                                <span className={`text-xs flex items-center gap-1 ${getPriorityColor(task.due_date)}`}>
                                    <Clock size={12} />
                                    {formatDistanceToNow(parseISO(task.due_date), { addSuffix: true, locale: es })}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">{task.topic}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">{task.description}</p>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(task.due_date).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                    task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-300'
                                    }`}>{task.status === 'pending' ? 'Pendiente' : task.status}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
