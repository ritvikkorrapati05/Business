import Link from "next/link";
import { LayoutDashboard, Users, Settings, MessageSquare } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">VerdictFlow AI</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link 
            href="/dashboard/leads" 
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users size={20} />
            Leads
          </Link>
          <Link 
            href="/dashboard/conversations" 
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageSquare size={20} />
            Conversations
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <div className="text-sm">
              <p className="font-semibold">Admin User</p>
              <p className="text-gray-500">Firm Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
