import { MarsLogo } from './MarsLogo';
import { MarsButton } from './MarsButton';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, Upload, LogOut } from 'lucide-react';

export const MarsHeaderNav = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-mars-blue-secondary bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <MarsLogo className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-bold">Mars DCom Intelligence</h1>
            <p className="text-xs text-muted-foreground">Performance Dashboard</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-success/20 text-success">
              ● Live
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <MarsButton variant="ghost" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Data
          </MarsButton>

          <MarsButton variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </MarsButton>

          <MarsButton variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </MarsButton>

          <div className="flex items-center gap-2 pl-2 border-l border-mars-blue-secondary">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Key Account Manager</p>
            </div>
            <MarsButton variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </MarsButton>
          </div>
        </div>
      </div>
    </header>
  );
};