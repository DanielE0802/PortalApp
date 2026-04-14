'use client';

import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-lg',
} as const;

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 64,
} as const;

const colorVariants = [
  'bg-[var(--accent-primary-bg-strong)] text-[var(--accent-primary)]',
] as const;

function getColorForName(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorVariants[hash % colorVariants.length];
}

export function Avatar({ src, alt, name = '', size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getColorForName(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  );
}
