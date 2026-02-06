import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { TaskForm } from '../components/Task/TaskForm';
import { TaskCard } from '../components/Task/TaskCard';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUBJECTS } from '../utils/constants';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterSubject, setFilterSubject] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('due_date', { ascending: true });

        if (error) console.error('Error fetching tasks:', error);
        else setTasks(data || []);
        setLoading(false);
    }

    const handleCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    }

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleTaskSaved = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        fetchTasks();
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) toast.error('Error al eliminar');
        else {
            toast.success('Tarea eliminada');
            fetchTasks();
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
        if (error) toast.error('Error al actualizar estatus');
        else {
            toast.success('Estatus actualizado');
            fetchTasks();
        }
    };

    const filteredTasks = filterSubject
        ? tasks.filter(t => t.subject === filterSubject)
        : tasks;

    return (
        <MainLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-100 hidden md:block">Mis Tareas</h2>

                <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                    <select
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                    >
                        <option value="">Todas las asignaturas</option>
                        {SUBJECTS.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>

                    <Button onClick={handleCreate} className="flex items-center justify-center gap-2 whitespace-nowrap">
                        <Plus size={18} /> Nueva Tarea
                    </Button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? "Editar Tarea" : "Nueva Tarea"}>
                <TaskForm
                    initialData={editingTask}
                    onSuccess={handleTaskSaved}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div></div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                    <p>{filterSubject ? 'No hay tareas para esta asignatura.' : 'No tienes tareas pendientes.'}</p>
                    <Button variant="ghost" onClick={handleCreate} className="mt-2 text-emerald-400 hover:text-emerald-300">Crear primera tarea</Button>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
