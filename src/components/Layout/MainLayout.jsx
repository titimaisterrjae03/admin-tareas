import React from 'react';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur z-10">
                <h1 className="text-xl font-bold text-emerald-400">TaskMgr</h1>
                <button className="p-2 text-slate-400 hover:text-white">
                    <Settings size={20} />
                </button>
            </header>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 border-r border-slate-800 flex-col p-4 sticky top-0 h-screen">
                <h1 className="text-2xl font-bold text-emerald-400 mb-8">Engineering TaskMgr</h1>
                <nav className="flex-1 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={CheckSquare} label="Tasks" />
                </nav>
                <div className="pt-4 border-t border-slate-800">
                    <NavItem icon={Settings} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8 max-w-5xl mx-auto w-full">
                {children}
            </main>

            {/* Bottom Nav (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-2 flex justify-around z-10 safe-area-bottom">
                <MobileNavItem icon={LayoutDashboard} label="Dash" active />
                <MobileNavItem icon={CheckSquare} label="Tasks" />
                <MobileNavItem icon={Settings} label="Settings" />
            </nav>
        </div>
    );
}

function NavItem({ icon: Icon, label, active }) {
    return (
        <button className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${active ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    )
}

function MobileNavItem({ icon: Icon, label, active }) {
    return (
        <button className={`flex flex-col items-center p-2 rounded-lg ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
        </button>
    )
}
