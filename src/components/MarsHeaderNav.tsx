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
    <header className="sticky top-0 z-30 border-b border-mars-blue-secondary bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <MarsLogo className="h-10 w-auto" />
            <p className="text-xs text-muted-foreground mt-1">DCom Intelligence Performance Dashboard</p>
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
            <Upload className={`h-4 w-4 mr-2 ${isUploading ? 'animate-spin' : ''}`} />
            {isUploading ? 'Processing...' : 'Upload Data'}
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