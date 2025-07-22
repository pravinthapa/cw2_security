import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Settings, User, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LifeLockr</span>
          </Link>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              
              <div className="bg-primary-light p-2 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;