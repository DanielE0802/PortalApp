'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useLoginMutation } from '@/store/api/usersApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap();
      authLogin(result.data.token);
      toast('¡Inicio de sesión exitoso!', { variant: 'success' });
    } catch {
      toast('Credenciales inválidas. Intenta de nuevo.', { variant: 'error' });
    }
  };

  const fillTestCredentials = () => {
    setValue('email', 'eve.holt@reqres.in');
    setValue('password', 'cityslicka');
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary">Login</h1>
        <p className="text-sm text-muted-foreground">
          Bienvenido de nuevo a PortalApp
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">o</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={fillTestCredentials}
      >
        Usar credenciales de prueba
      </Button>
    </Card>
  );
}
