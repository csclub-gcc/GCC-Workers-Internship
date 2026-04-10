import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Clock } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A32035] to-[#8A1B2E] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center bg-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-[#FFC629] rounded-full p-4 shadow-lg">
              <Clock className="h-10 w-10 text-[#A32035]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#A32035]">Glendale Community College</CardTitle>
          <CardDescription className="text-[#737373] mt-2">Timesheet Management Portal</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@glendale.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 focus:border-[#A32035]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 focus:border-[#A32035]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-[#A32035] hover:bg-[#8A1B2E] text-white">
              Login
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-2 font-medium">Demo Credentials:</p>
            <div className="text-xs space-y-2 bg-[#F5F5F4] p-3 rounded-md">
              <p className="flex justify-between"><span className="font-semibold text-[#A32035]">Admin:</span> <span>admin@example.com / admin123</span></p>
              <p className="flex justify-between"><span className="font-semibold text-[#A32035]">Student:</span> <span>student@example.com / student123</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}