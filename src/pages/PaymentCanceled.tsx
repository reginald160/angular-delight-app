import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Payment Canceled</h1>
        
        <p className="text-muted-foreground">
          Your payment was canceled. No charges were made to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => navigate('/price')} variant="default">
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
