import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { text: 'Mindestens 6 Zeichen', met: password.length >= 6 },
    { text: 'Passwörter stimmen überein', met: password === confirmPassword && password.length > 0 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein.');
      return;
    }

    if (password.length < 6) {
      toast.error('Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Registrierung erfolgreich! Bitte prüfen Sie Ihre E-Mails.');
        navigate('/login');
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
            Account erstellen
          </CardTitle>
          <CardDescription className="text-base">
            Registrieren Sie sich für Ihren kostenlosen Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Max"
                  required
                  className="cb-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mustermann"
                  required
                  className="cb-input"
                />
              </div>
            </div>

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
                  placeholder="Sicheres Passwort"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Passwort wiederholen"
                  required
                  className="cb-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <Label className="text-sm">Passwort-Anforderungen:</Label>
                <div className="space-y-1">
                  {passwordRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        requirement.met 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Check size={12} />
                      </div>
                      <span className={requirement.met ? 'text-green-700' : 'text-gray-500'}>
                        {requirement.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full cb-btn-primary"
              disabled={isLoading || passwordRequirements.some(req => !req.met)}
            >
              {isLoading ? 'Wird erstellt...' : 'Account erstellen'}
              <UserPlus size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Bereits ein Account?{' '}
              <Link 
                to="/login" 
                className="font-medium hover:underline"
                style={{ color: 'hsl(var(--color-primary))' }}
              >
                Jetzt anmelden
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