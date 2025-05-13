
import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, MapPin, ArrowRight, Plus, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Início", icon: <FileText className="w-5 h-5" /> },
    { path: "/projeto", label: "Projeto", icon: <FileText className="w-5 h-5" /> },
    { path: "/beneficiario", label: "Beneficiário", icon: <FileText className="w-5 h-5" /> },
    { path: "/confrontantes", label: "Confrontantes", icon: <ArrowRight className="w-5 h-5" /> },
    { path: "/vertices", label: "Vértices", icon: <MapPin className="w-5 h-5" /> },
    { path: "/memorial", label: "Memorial", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Memorial Descritivo</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col",
        isMobile ? 
          `fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-200 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}` : 
          "w-64"
      )}>
        {!isMobile && (
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary">Memorial Descritivo</h1>
            <p className="text-sm text-gray-500">Sistema de Geração</p>
          </div>
        )}

        {isMobile && (
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">Sistema de Geração</p>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={isMobile ? () => setSidebarOpen(false) : undefined}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">© 2025 Memorial Descritivo</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isMobile && sidebarOpen ? "opacity-50" : ""
      )}>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile backdrop overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;
