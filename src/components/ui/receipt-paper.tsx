import { Text, View } from 'react-native';

interface Props {
  lines: string[];
}

/** On-screen preview of what the thermal printer prints. */
export default function ReceiptPaper({ lines }: Props) {
  return (
    <View className="self-center rounded-xl bg-paper px-4 py-5">
      <Text style={{ fontFamily: 'monospace' }} className="text-[13px] leading-5 text-ink">
        {lines.join('\n')}
      </Text>
    </View>
  );
}
