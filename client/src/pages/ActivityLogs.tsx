import React, { useState, useEffect } from 'react';
import { Activity, Shield, Eye, Download, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../services/api';

interface ActivityLog {
  id: string;
  action: string;
  itemType: string;
  itemTitle: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    loadActivityLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, actionFilter]);

  const loadActivityLogs = async () => {
    try {
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      // Demo data
      setLogs([
        {
          id: '1',
          action: 'LOGIN',
          itemType: 'AUTH',
          itemTitle: 'User Login',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome 120.0.0.0',
          timestamp: new Date().toISOString(),
          success: true
        },
        {
          id: '2',
          action: 'VAULT_VIEW',
          itemType: 'LOGIN',
          itemTitle: 'Gmail Account',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome 120.0.0.0',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          success: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (actionFilter !== 'ALL') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return <Shield className="h-4 w-4" />;
      case 'VAULT_VIEW':
      case 'VAULT_EDIT':
        return <Eye className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (success: boolean) => {
    return success ? 'text-success bg-success-light' : 'text-destructive bg-destructive-light';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient">Activity Logs</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor your account activity and security events</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="form-input w-48"
        >
          <option value="ALL">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="VAULT_VIEW">Vault View</option>
          <option value="VAULT_EDIT">Vault Edit</option>
        </select>
      </div>

      <Card className="card-security">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getActionColor(log.success)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <p className="font-medium">{log.action.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">{log.itemTitle}</p>
                        <p className="text-xs text-muted-foreground">{log.ipAddress} • {log.userAgent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.success ? "default" : "destructive"}>
                        {log.success ? 'Success' : 'Failed'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;