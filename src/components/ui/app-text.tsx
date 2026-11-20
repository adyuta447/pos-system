import { Text, type TextProps } from 'react-native';

export interface AppTextProps extends TextProps {
  className?: string;
}

/** Text with the house font and ink color as defaults. Override with className. */
export default function AppText({ className = '', ...props }: AppTextProps) {
  return <Text {...props} className={`font-body text-ink ${className}`} />;
}
