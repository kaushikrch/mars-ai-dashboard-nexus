import { useState, useRef } from 'react';
import { MarsLogo } from './MarsLogo';
import { MarsButton } from './MarsButton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Settings, User, Upload, LogOut } from 'lucide-react';

export const MarsHeaderNav = () => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, Excel, or JSON file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful",
        description: `${file.name} has been processed and integrated into your dashboard.`,
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MarsLogo className="h-12 w-auto" />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">DCom Intelligence</p>
              <p className="text-xs text-muted-foreground">Performance Dashboard</p>
            </div>
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <MarsButton 
            variant="ghost" 
            size="sm"
            onClick={triggerFileUpload}
            disabled={isUploading}
          >
            <Upload className={`h-4 w-4 mr-2 text-primary ${isUploading ? 'animate-spin' : ''}`} />
            {isUploading ? 'Processing...' : 'Upload Data'}
          </MarsButton>

          <MarsButton variant="ghost" size="sm">
            <Bell className="h-4 w-4 text-primary" />
          </MarsButton>

          <MarsButton variant="ghost" size="sm">
            <Settings className="h-4 w-4 text-primary" />
          </MarsButton>

          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Key Account Manager</p>
            </div>
            <MarsButton variant="ghost" size="sm">
              <LogOut className="h-4 w-4 text-accent" />
            </MarsButton>
          </div>
        </div>
      </div>
    </header>
  );
};