import { Voca } from "@/types/vocab";
import { Text, View } from "react-native";

export default function MyStorageResultView({ data }: { data: Voca[] | null }) {
  if (data === null) return <View></View>;

  if (data.length === 0) return <View></View>;

  return (
    <View>
      <Text>Test</Text>
    </View>
  );
}
