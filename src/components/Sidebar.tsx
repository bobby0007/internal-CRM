import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe2, 
  LogOut, 
  Command,
  Settings,
  ChevronRight,
  Timer,
  Sliders,
  MessageSquare,
  FileCode
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', label: 'Merchant Status', icon: ShieldCheck },
    { path: '/international', label: 'International Txns', icon: Globe2 },
    { path: '/communications', label: 'Communications', icon: MessageSquare },
    { path: '/template-config', label: 'Template Config', icon: FileCode },
    { path: '/rate-limit', label: 'Rate Limits', icon: Timer },
    { path: '/config', label: 'Configuration', icon: Sliders },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className={cn(
      "w-64 bg-white border-r flex flex-col relative",
      "before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:opacity-50",
      className
    )}>
      {/* Header */}
      <div className="h-16 border-b flex items-center px-6 relative backdrop-blur-sm bg-white/50">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Command className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="ml-1 font-semibold text-lg bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Operations Hub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300',
                'hover:bg-primary/5 relative overflow-hidden',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                  : 'text-gray-700 hover:text-primary'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "h-5 w-5 mr-3 transition-transform duration-300",
                  "group-hover:scale-110",
                  isActive && "animate-pulse"
                )} />
                <span>{item.label}</span>
                <ChevronRight className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-300",
                  "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                  isActive && "opacity-100 translate-x-0"
                )} />
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-all duration-300"
          >
            <Settings className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:rotate-90" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <LogOut className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;