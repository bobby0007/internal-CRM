import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe2, 
  LogOut, 
  Menu, 
  X, 
  Command,
  Bell,
  Search,
  Timer,
  Sliders,
  MessageSquare,
  FileCode
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Merchant Status', icon: ShieldCheck },
    { path: '/international', label: 'International Txns', icon: Globe2 },
    { path: '/communications', label: 'Communications', icon: MessageSquare },
    { path: '/template-config', label: 'Template Config', icon: FileCode },
    { path: '/rate-limit', label: 'Rate Limits', icon: Timer },
    { path: '/config', label: 'Configuration', icon: Sliders },
    { path: '/silent-auth-config', label: 'Silent Auth Config', icon: LogOut }, // You can swap LogOut for a more suitable icon
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white border-b relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
        <div className="px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Only visible on mobile */}
            <div className="lg:hidden flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Command className="h-8 w-8 text-primary" />
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex relative hover:bg-primary/5 transition-colors duration-300"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-primary/5 transition-colors duration-300"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMobileMenuOpen ? 'close' : 'menu'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu className="h-6 w-6" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Side Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Command className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                    Navigation
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center px-6 py-3 text-sm font-medium transition-all duration-300',
                            isActive
                              ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-inner'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                          )
                        }
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;