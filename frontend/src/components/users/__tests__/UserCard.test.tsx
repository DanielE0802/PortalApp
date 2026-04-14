import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../UserCard';
import type { ReqresUser } from '@/store/api/usersApi';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const baseUser: ReqresUser = {
  id: 1,
  email: 'george.bluth@reqres.in',
  first_name: 'George',
  last_name: 'Bluth',
  avatar: 'https://reqres.in/img/faces/1-image.jpg',
  isSaved: false,
  localId: null,
};

describe('UserCard', () => {
  it('muestra badge "Guardado" y botón deshabilitado cuando isSaved=true', () => {
    const savedUser: ReqresUser = { ...baseUser, isSaved: true, localId: 10 };
    render(<UserCard user={savedUser} onImport={vi.fn()} importing={false} />);

    expect(screen.getByText('Guardado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /importado/i })).toBeDisabled();
  });

  it('llama onImport con el ID correcto al hacer clic en Importar', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();

    render(<UserCard user={baseUser} onImport={onImport} importing={false} />);

    await user.click(screen.getByRole('button', { name: /importar/i }));

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledWith(1);
  });
});
