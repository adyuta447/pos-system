import { View } from "react-native";

import AppText from "@/components/ui/app-text";
import Button from "@/components/ui/button";
import type { User } from "@/db/users";

interface UserPickerProps {
  users: User[];
  selectedId: string | null;
  onSelect(user: User): void;
}

export default function UserPicker({
  users,
  selectedId,
  onSelect,
}: UserPickerProps) {
  return (
    <View>
      <AppText className="mb-3 font-heading text-xl" accessibilityRole="header">
        Siapa yang jaga kasir?
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {users.map((user) => (
          <Button
            key={user.id}
            label={user.role === "owner" ? `${user.name} (pemilik)` : user.name}
            selected={selectedId === user.id}
            onPress={() => onSelect(user)}
          />
        ))}
      </View>
    </View>
  );
}
