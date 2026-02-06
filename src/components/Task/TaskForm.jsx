import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import toast from 'react-hot-toast';

export function TaskForm({ onSuccess, onCancel, initialData }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: initialData?.subject || '',
        topic: initialData?.topic || '',
        description: initialData?.description || '',
        due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : '',
        status: initialData?.status || 'pending'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let error;
            if (initialData?.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update({
                        ...formData,
                        due_date: new Date(formData.due_date).toISOString()
                    })
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                // Create new
                const { error: insertError } = await supabase.from('tasks').insert([
                    {
                        ...formData,
                        due_date: new Date(formData.due_date).toISOString()
                    }
                ]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(initialData ? 'Tarea actualizada' : 'Tarea creada exitosamente');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar: ' + (error.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Asignatura</label>
                <select
                    className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 p-2 outline-none transition-all appearance-none"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                    <option value="" disabled>Selecciona una asignatura</option>
                    <option value="ADMINISTRACION DE EMPRESAS">ADMINISTRACION DE EMPRESAS</option>
                    <option value="ANALISIS Y DISEÑO DE SISTEMAS">ANALISIS Y DISEÑO DE SISTEMAS</option>
                    <option value="ARQUITECTURA DE REDES DE COMPUTADORES">ARQUITECTURA DE REDES DE COMPUTADORES</option>
                    <option value="ESTADISTICA APLICADA">ESTADISTICA APLICADA</option>
                    <option value="SISTEMA DE BASE DE DATOS">SISTEMA DE BASE DE DATOS</option>
                    <option value="SISTEMA DE OPERACION I">SISTEMA DE OPERACION I</option>
                </select>
            </div>
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
                    {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear Tarea')}
                </Button>
            </div>
        </form>
    );
}
