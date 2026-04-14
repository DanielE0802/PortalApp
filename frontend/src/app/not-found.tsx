import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="flex justify-center">
          <FileQuestion className="size-16 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg font-medium text-foreground">Página no encontrada</p>
          <p className="text-sm text-muted-foreground">
            La página que buscas no existe o fue movida.
          </p>
        </div>
        <Link href="/users">
          <Button className="gap-2">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
