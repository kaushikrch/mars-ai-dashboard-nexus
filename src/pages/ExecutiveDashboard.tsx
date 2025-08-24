import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { MarsHeaderNav } from '@/components/MarsHeaderNav';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExecutiveDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <MarsHeaderNav />
      
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
        </div>
        
        <ExecutiveSummary />
      </main>
    </div>
  );
};