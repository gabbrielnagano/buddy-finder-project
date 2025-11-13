import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Se já completou o reset, não processar novamente
    if (passwordResetComplete) {
      return;
    }

    const validateToken = async () => {
      console.log('URL atual:', window.location.href);
      console.log('Search params:', Object.fromEntries(searchParams.entries()));
      
      const accessToken = searchParams.get('access_token') || searchParams.get('token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('Erro na URL:', error, errorDescription);
        toast.error(`Erro: ${errorDescription || error}`);
        setTimeout(() => navigate('/login'), 3000);
        setCheckingToken(false);
        return;
      }

      if (type === 'recovery' && accessToken) {
        console.log('Tentando definir sessão com tokens...');
        try {
          const sessionData = refreshToken 
            ? { access_token: accessToken, refresh_token: refreshToken }
            : { access_token: accessToken, refresh_token: '' };

          const { data, error } = await supabase.auth.setSession(sessionData);
          
          if (error) {
            console.error('Erro ao definir sessão:', error);
            toast.error('Link de recuperação inválido ou expirado');
            setTimeout(() => navigate('/login'), 3000);
          } else {
            console.log('Sessão definida com sucesso:', data);
            setIsValidToken(true);
            toast.success('Link de recuperação válido! Defina sua nova senha.');
          }
        } catch (err) {
          console.error('Erro inesperado:', err);
          toast.error('Erro ao processar link de recuperação');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Sessão já existe:', session);
          setIsValidToken(true);
          toast.success('Sessão de recuperação ativa! Defina sua nova senha.');
        } else {
          console.log('Nenhum token válido encontrado na URL');
          toast.error('Link de recuperação inválido. Solicite um novo link.');
          setTimeout(() => navigate('/login'), 3000);
        }
      }
      
      setCheckingToken(false);
    };

    validateToken();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      if (event === 'PASSWORD_RECOVERY' || event === 'TOKEN_REFRESHED') {
        setIsValidToken(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams, passwordResetComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidToken) {
      toast.error('Token de recuperação inválido');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    console.log('Iniciando processo de redefinição de senha...');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        toast.error('Erro ao redefinir senha: ' + error.message);
        setLoading(false);
      } else {
        console.log('Senha atualizada com sucesso!');
        toast.success('Senha redefinida com sucesso!');
        
        // Marcar como completo e redirecionar após um tempo
        setPasswordResetComplete(true);
        
        // Fazer logout e redirecionar com timeout
        setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao redefinir senha');
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    console.log('Voltando ao login manualmente...');
    setPasswordResetComplete(true);
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Se já completou o reset, mostrar mensagem de sucesso com botão manual
  if (passwordResetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-gradient p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Senha Redefinida!</CardTitle>
            <CardDescription>
              Sua senha foi redefinida com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Redirecionando para o login...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full"
              variant="outline"
            >
              Ir para Login Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-gradient p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verificando...</CardTitle>
            <CardDescription>
              Validando link de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-gradient p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Link Inválido</CardTitle>
            <CardDescription>
              O link de recuperação não é válido ou expirou
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Você será redirecionado para a página de login em alguns segundos.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-gradient p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redefinindo...
                  </div>
                ) : (
                  'Redefinir Senha'
                )}
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleBackToLogin}
                disabled={loading}
              >
                Voltar ao Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
