
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, MapPin, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Memorial Descritivo</h1>
          <p className="text-sm text-gray-500">Sistema de Geração</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
