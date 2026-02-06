import React from 'react';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden p-4 border-b border-slate-800 flex items-center justify-center sticky top-0 bg-slate-950/80 backdrop-blur z-10">
                <h1 className="text-lg font-bold text-emerald-400">Administrador de Tareas</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
