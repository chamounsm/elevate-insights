import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export const ChatBot = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-dashboard-primary" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[500px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">AI Assistant Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Your intelligent assistant for influencer insights, campaign optimization, and data analysis will be available here soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};