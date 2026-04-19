import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary:   'bg-[var(--accent-1)] text-white hover:brightness-110',
  secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:brightness-125',
  danger:    'bg-[var(--error)] text-white hover:brightness-110',
  success:   'bg-[var(--success)] text-black hover:brightness-110',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export function PixelButton({
  children,
  variant = 'primary',
  glow = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={`
        font-pixel pixel-border cursor-pointer
        transition-all duration-150 active:translate-y-0.5
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${glow && !disabled ? 'glow-roll' : ''}
        ${className}
      `}
      style={{ fontSize: size === 'sm' ? '8px' : size === 'lg' ? '14px' : '10px' }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
