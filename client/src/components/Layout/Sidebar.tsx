import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  Upload, 
  CreditCard, 
  Activity, 
  Settings,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Vault',
    href: '/vault',
    icon: Shield,
  },
  // {
  //   name: 'Emergency Contacts',
  //   href: '/emergency-contacts',
  //   icon: Users,
  // },
  {
    name: 'File Upload',
    href: '/upload',
    icon: Upload,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
  {
    name: 'Activity Logs',
    href: '/logs',
    icon: Activity,
  },
  {
    name: 'Admin Audit',
    href: '/admin/audit',
    icon: UserCheck,
    roles: ['ADMIN'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;