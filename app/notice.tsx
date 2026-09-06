import NoticeHeader from "@/components/notice/NoticeHeader";
import NoticeViewer from "@/components/notice/NoticeViewer";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Notice } from "@/types/notice";

export default function NoticeScreen() {
  const [notice, setNotice] = useState<Notice[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_SERVER_ADDRESS}/notice/notices/`);
        if (!res.ok) throw new Error(`Notice request failed (${res.status}).`);
        const res_json = await res.json();
        setNotice(res_json.results);
      } catch {
        setNotice([
          { id: 0, title: "error", details: "error", created_at: "" },
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NoticeHeader />
      <NoticeViewer notice={notice} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#2988F6",
  },
});
