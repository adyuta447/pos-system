import { TextInput, View, type TextInputProps } from 'react-native';

import palette from '@/constants/palette';

import AppText from './app-text';

interface Props extends TextInputProps {
  /** Visible label above the field. Also used as the accessibility label. */
  label?: string;
  /** Background, chosen to contrast with the surface the field sits on. */
  surface?: 'paper' | 'peach';
}

export default function TextField({ label, surface = 'paper', accessibilityLabel, ...props }: Props) {
  return (
    <View className="gap-1">
      {label && <AppText className="font-label text-base">{label}</AppText>}
      <TextInput
        placeholderTextColor={palette.placeholder}
        accessibilityLabel={accessibilityLabel ?? label}
        {...props}
        className={`min-h-12 rounded-2xl border-2 border-line px-4 font-body text-lg text-ink ${surface === 'paper' ? 'bg-paper' : 'bg-peach'}`}
      />
    </View>
  );
}
