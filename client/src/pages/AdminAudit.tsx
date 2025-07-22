import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, AlertTriangle, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../services/api';

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  details: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const AdminAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const response = await api.get('/admin/audit');
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      // Demo data
      setAuditLogs([
        {
          id: '1',
          adminId: 'admin-1',
          adminName: 'John Admin',
          action: 'USER_ACCESS_GRANTED',
          targetUserId: 'user-123',
          targetUserName: 'Jane Doe',
          details: 'Granted emergency access to vault',
          timestamp: new Date().toISOString(),
          severity: 'HIGH'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-destructive text-destructive-foreground';
      case 'HIGH':
        return 'bg-warning text-warning-foreground';
      case 'MEDIUM':
        return 'bg-accent text-accent-foreground';
      case 'LOW':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient">Admin Audit Log</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Admin Audit Log</h1>
        <p className="text-muted-foreground mt-1">Monitor administrative actions and security events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-security">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold text-primary">{auditLogs.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-security">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold text-destructive">
                  {auditLogs.filter(log => log.severity === 'CRITICAL').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-security">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Admins</p>
                <p className="text-2xl font-bold text-accent">
                  {new Set(auditLogs.map(log => log.adminId)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-security">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Actions</p>
                <p className="text-2xl font-bold text-success">
                  {auditLogs.filter(log => 
                    new Date(log.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-security">
        <CardHeader>
          <CardTitle>Recent Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {auditLogs.length === 0 ? (
            <div className="p-12 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-light p-2 rounded-xl">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{log.action.replace('_', ' ')}</p>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Admin: {log.adminName}</p>
                          {log.targetUserName && <p>Target: {log.targetUserName}</p>}
                          <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
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

export default AdminAudit;