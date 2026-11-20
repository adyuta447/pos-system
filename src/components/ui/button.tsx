import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

export type ButtonVariant = 'red' | 'green' | 'orange' | 'paper' | 'peach' | 'ink';
export type ButtonSize = 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label?: string;
  /** Custom content instead of label. */
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  selected?: boolean;
  className?: string;
}

const SURFACE: Record<ButtonVariant, string> = {
  red: 'bg-red',
  green: 'bg-green',
  orange: 'bg-orange',
  paper: 'bg-paper border-2 border-line',
  peach: 'bg-peach',
  ink: 'bg-ink',
};
const TEXT_COLOR: Record<ButtonVariant, string> = {
  red: 'text-paper',
  green: 'text-ink',
  orange: 'text-ink',
  paper: 'text-ink',
  peach: 'text-ink',
  ink: 'text-paper',
};
const HEIGHT: Record<ButtonSize, string> = { md: 'min-h-12 px-4', lg: 'min-h-16 px-5', xl: 'min-h-20 px-6' };
const TEXT_SIZE: Record<ButtonSize, string> = { md: 'text-base', lg: 'text-lg', xl: 'text-2xl' };

/**
 * Solid button, at least 48dp tall (spec 3.1). Press feedback is a small squash, never transparency.
 * `selected` renders the ink variant, used for toggles and tabs.
 */
export default function Button({
  label,
  children,
  variant = 'paper',
  size = 'md',
  selected,
  disabled,
  className = '',
  accessibilityState,
  ...props
}: ButtonProps) {
  const tone: ButtonVariant = selected ? 'ink' : variant;
  const surface = disabled ? 'bg-line' : SURFACE[tone];
  const textColor = disabled ? 'text-ink' : TEXT_COLOR[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected, ...accessibilityState }}
      disabled={disabled}
      {...props}
      className={`${surface} ${HEIGHT[size]} items-center justify-center rounded-2xl active:scale-95 ${className}`}>
      {children ?? <Text className={`font-heading ${textColor} ${TEXT_SIZE[size]}`}>{label}</Text>}
    </Pressable>
  );
}
