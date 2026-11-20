import { View } from 'react-native';

import AppText from './app-text';

interface Props {
  message: string;
}

/** Bottom message bar. Renders nothing when the message is empty. Pair with useToast(). */
export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <View className="absolute bottom-6 left-4 right-4 items-center" pointerEvents="none">
      <View className="rounded-2xl bg-ink px-5 py-3">
        <AppText className="font-label text-base text-paper" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      </View>
    </View>
  );
}
