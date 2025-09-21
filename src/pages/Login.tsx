import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Erfolgreich eingeloggt!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-heading" style={{ color: 'hsl(var(--foreground))' }}>
            Willkommen zurück
          </CardTitle>
          <CardDescription className="text-base">
            Melden Sie sich in Ihrem Account an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                className="cb-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ihr Passwort"
                  required
                  className="cb-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full cb-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Wird geladen...' : 'Anmelden'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Noch kein Account?{' '}
              <Link 
                to="/register" 
                className="font-medium hover:underline"
                style={{ color: 'hsl(var(--color-primary))' }}
              >
                Jetzt registrieren
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/company/register" 
              className="text-sm text-muted-foreground hover:underline"
            >
              Als Unternehmen registrieren
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}