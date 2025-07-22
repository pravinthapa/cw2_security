import React, { useState, useEffect } from 'react';
import { Shield, Plus, Star, Activity, Users, CreditCard, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { vaultService, VaultItem } from '../services/vault';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalItems: number;
  itemsByType: Record<string, number>;
  recentActivity: Array<{
    action: string;
    itemTitle: string;
    timestamp: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [items, analytics] = await Promise.all([
          vaultService.getVaultItems(),
          vaultService.getVaultAnalytics()
        ]);
        
        setVaultItems(items.slice(0, 5)); // Show only first 5 items
        setStats(analytics);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LOGIN':
        return <Shield className="h-4 w-4 text-primary" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-4 w-4 text-accent" />;
      case 'SECURE_NOTE':
        return <Eye className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Shield className="h-4 w-4 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to LifeLockr</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName}! Here's your security overview.
          </p>
        </div>
        <Link to="/vault">
          <Button className="btn-security">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-security hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{stats?.totalItems || 0}</p>
              </div>
              <div className="bg-primary-light p-3 rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-security hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Logins</p>
                <p className="text-2xl font-bold text-accent">{stats?.itemsByType?.LOGIN || 0}</p>
              </div>
              <div className="bg-accent-light p-3 rounded-xl">
                <Shield className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-security hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cards</p>
                <p className="text-2xl font-bold text-warning">{stats?.itemsByType?.CREDIT_CARD || 0}</p>
              </div>
              <div className="bg-warning-light p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-security hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Secure Notes</p>
                <p className="text-2xl font-bold text-success">{stats?.itemsByType?.SECURE_NOTE || 0}</p>
              </div>
              <div className="bg-success-light p-3 rounded-xl">
                <Eye className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vault Items */}
        <Card className="card-security">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Vault Items</CardTitle>
            <Link to="/vault" className="text-sm text-accent hover:text-accent-hover transition-colors">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {vaultItems.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No vault items yet</p>
                <Link to="/vault">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Button>
                </Link>
              </div>
            ) : (
              vaultItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/vault/${item.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.type.toLowerCase().replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.favorite && <Star className="h-4 w-4 text-warning fill-current" />}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-security">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Link to="/logs" className="text-sm text-accent hover:text-accent-hover transition-colors">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.recentActivity?.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              stats?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                  <div className="bg-primary-light p-2 rounded-lg mt-0.5">
                    <Activity className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.itemTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-security">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/vault" className="block">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Add Login</span>
              </Button>
            </Link>
            
            <Link to="/emergency-contacts" className="block">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <Users className="h-6 w-6 text-accent" />
                <span>Emergency Contacts</span>
              </Button>
            </Link>
            
            <Link to="/upload" className="block">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <Plus className="h-6 w-6 text-success" />
                <span>Upload File</span>
              </Button>
            </Link>
            
            <Link to="/billing" className="block">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <CreditCard className="h-6 w-6 text-warning" />
                <span>Billing</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;