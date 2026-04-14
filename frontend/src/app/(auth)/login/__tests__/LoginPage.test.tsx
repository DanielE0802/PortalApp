import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { TestProvider } from '@/test/mockStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
  usePathname: () => '/',
}));

vi.mock('@/store/api/usersApi', () => ({
  useLoginMutation: () => [vi.fn().mockResolvedValue({ data: { token: 'test-token' } }), { isLoading: false }],
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: vi.fn(), logout: vi.fn(), isAuthenticated: false }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

function renderLogin() {
  return render(
    <TestProvider>
      <LoginPage />
    </TestProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra errores de validación al enviar el formulario vacío', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /iniciar sesi/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inv/i)).toBeInTheDocument();
    });
  });

  it('botón "Usar credenciales de prueba" rellena los campos correctamente', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /credenciales de prueba/i }));

    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('eve.holt@reqres.in');
    expect((screen.getByLabelText(/contraseña/i) as HTMLInputElement).value).toBe('cityslicka');
  });
});
