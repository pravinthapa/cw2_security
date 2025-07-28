import React from "react";
import {
  Shield,
  Zap,
  FileUp,
  Users,
  Eye,
  AlertTriangle,
  Crown,
  Star,
  Lock,
  Download,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const PremiumFeatures: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-gradient">Premium Features</h1>
          <Badge className="bg-accent text-accent-foreground">Active</Badge>
        </div>
        <p className="text-muted-foreground">
          Unlock advanced security features and unlimited storage
        </p>
      </div>

      {/* Premium Status Card */}
      <Card className="card-security border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-accent p-3 rounded-2xl">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Premium Subscriber</h3>
                <p className="text-muted-foreground">
                  All premium features unlocked
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing</p>
              <p className="font-semibold">March 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Unlimited Storage */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Unlimited Items</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Store unlimited passwords, secure notes, and digital assets
            </p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Current Items:</span>
                <span className="font-semibold">247 / ∞</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Attachments */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-accent p-2 rounded-lg">
                <FileUp className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">File Attachments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Attach files up to 1GB to your vault items
            </p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Storage Used:</span>
                <span className="font-semibold">234 MB / 1 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: "23%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Access */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-warning p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Emergency Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Grant trusted contacts emergency access to your vault
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Manage Emergency Contacts
            </Button>
          </CardContent>
        </Card>

        {/* Security Dashboard */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-success p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Security Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Advanced security insights and vulnerability reports
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Weak passwords:</span>
                <span className="text-warning">3</span>
              </div>
              <div className="flex justify-between">
                <span>Reused passwords:</span>
                <span className="text-destructive">5</span>
              </div>
              <div className="flex justify-between">
                <span>Security score:</span>
                <span className="text-success font-semibold">87/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Web Monitoring */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-destructive p-2 rounded-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Dark Web Monitoring</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Monitor the dark web for compromised credentials
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>All clear - no breaches detected</span>
            </div>
          </CardContent>
        </Card>

        {/* Priority Support */}
        <Card className="card-security">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Priority Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get priority email and chat support
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-success" />
              <span>Average response time: 2 hours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Password Generator */}
      <Card className="card-security">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-accent" />
            Advanced Password Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Premium Options</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Custom character sets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Pronounceable passwords</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Password patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Bulk generation (up to 100)</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Generated Password</h4>
              <div className="font-mono text-lg bg-background p-2 rounded border">
                Tr0ub4dor&3
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline">
                  Generate New
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card className="card-security">
        <CardHeader>
          <CardTitle>Premium Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">15</div>
              <div className="text-sm text-muted-foreground">
                Files Attached
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">87</div>
              <div className="text-sm text-muted-foreground">
                Security Score
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">3</div>
              <div className="text-sm text-muted-foreground">
                Alerts This Month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFeatures;
