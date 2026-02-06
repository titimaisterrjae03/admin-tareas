import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import toast from 'react-hot-toast';

export function TaskForm({ onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        description: '',
        due_date: '',
        status: 'pending'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('tasks').insert([
                {
                    ...formData,
                    due_date: new Date(formData.due_date).toISOString()
                }
            ]);

            if (error) throw error;

            toast.success('Tarea creada exitosamente');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Asignatura"
                placeholder="Ej: Cálculo Int."
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
            <Input
                label="Tema/Tópico"
                placeholder="Ej: Integrales impropias"
                required
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
            />
            <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Descripción</label>
                <textarea
                    className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 p-2 outline-none transition-all h-24"
                    placeholder="Detalles adicionales..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <Input
                label="Fecha de Entrega"
                type="datetime-local"
                required
                className="calendar-dark"
                value={formData.due_date}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</Button>
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? 'Guardando...' : 'Crear Tarea'}
                </Button>
            </div>
        </form>
    );
}
