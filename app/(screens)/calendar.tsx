import { getAllKegiatan, Kegiatan } from "@/services/kegiatan.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

// Define MarkedDates type manually
type MarkedDatesType = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadKegiatan();
  }, []);

  const loadKegiatan = async () => {
    try {
      const data = await getAllKegiatan();
      setKegiatanList(data);
      generateMarkedDates(data);
    } catch (error) {
      console.error("Error loading kegiatan:", error);
    }
  };

  const generateMarkedDates = (kegiatan: Kegiatan[]) => {
    const marked: MarkedDatesType = {};

    kegiatan.forEach((k) => {
      // Convert date format "20 Des 2024" to "2024-12-20"
      const dateStr = convertToISODate(k.date);
      if (dateStr) {
        marked[dateStr] = {
          marked: true,
          dotColor: getStatusColor(k.status),
        };
      }
    });

    setMarkedDates(marked);
  };

  const convertToISODate = (dateStr: string): string => {
    // Convert "20 Des 2024" to "2024-12-20"
    const months: { [key: string]: string } = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      Mei: "05",
      Jun: "06",
      Jul: "07",
      Agu: "08",
      Sep: "09",
      Okt: "10",
      Nov: "11",
      Des: "12",
    };

    const parts = dateStr.split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = months[parts[1]];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mendatang":
        return "#007AFF";
      case "berlangsung":
        return "#00C853";
      case "selesai":
        return "#999";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "mendatang":
        return "Akan Datang";
      case "berlangsung":
        return "Berlangsung";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const kegiatanOnDate = kegiatanList.filter(
      (k) => convertToISODate(k.date) === day.dateString
    );

    if (kegiatanOnDate.length === 1) {
      setSelectedKegiatan(kegiatanOnDate[0]);
      setModalVisible(true);
    }
  };

  const getKegiatanForDate = (date: string) => {
    return kegiatanList.filter((k) => convertToISODate(k.date) === date);
  };

  const renderKegiatanList = () => {
    if (!selectedDate) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            Pilih tanggal untuk melihat kegiatan
          </Text>
        </View>
      );
    }

    const kegiatanOnDate = getKegiatanForDate(selectedDate);

    if (kegiatanOnDate.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            Tidak ada kegiatan pada tanggal ini
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.kegiatanListContainer}>
        <Text style={styles.listTitle}>
          Kegiatan pada{" "}
          {new Date(selectedDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        {kegiatanOnDate.map((kegiatan) => (
          <TouchableOpacity
            key={kegiatan.id}
            style={styles.kegiatanCard}
            onPress={() => {
              setSelectedKegiatan(kegiatan);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Image source={{ uri: kegiatan.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{kegiatan.category}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(kegiatan.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(kegiatan.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {kegiatan.title}
              </Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{kegiatan.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{kegiatan.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: "#000",
                },
              }),
            }}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#000",
              selectedDayBackgroundColor: "#000",
              selectedDayTextColor: "#fff",
              todayTextColor: "#007AFF",
              dayTextColor: "#000",
              textDisabledColor: "#d9d9d9",
              dotColor: "#007AFF",
              selectedDotColor: "#fff",
              arrowColor: "#000",
              monthTextColor: "#000",
              textDayFontWeight: "500",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendar}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Keterangan:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#007AFF" }]}
              />
              <Text style={styles.legendText}>Akan Datang</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#00C853" }]}
              />
              <Text style={styles.legendText}>Berlangsung</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#999" }]} />
              <Text style={styles.legendText}>Selesai</Text>
            </View>
          </View>
        </View>

        {/* Kegiatan List */}
        <View style={styles.section}>{renderKegiatanList()}</View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>

            {selectedKegiatan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedKegiatan.image }}
                  style={styles.modalImage}
                />

                <View style={styles.modalBody}>
                  <View style={styles.modalHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {selectedKegiatan.category}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedKegiatan.status
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(selectedKegiatan.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalTitle}>
                    {selectedKegiatan.title}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {selectedKegiatan.description}
                  </Text>

                  <View style={styles.detailsSection}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={20} color="#007AFF" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Tanggal</Text>
                        <Text style={styles.detailValue}>
                          {selectedKegiatan.date}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={20} color="#007AFF" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Waktu</Text>
                        <Text style={styles.detailValue}>
                          {selectedKegiatan.time}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons name="location" size={20} color="#007AFF" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Lokasi</Text>
                        <Text style={styles.detailValue}>
                          {selectedKegiatan.location}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons name="people" size={20} color="#007AFF" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Peserta</Text>
                        <Text style={styles.detailValue}>
                          {selectedKegiatan.participants}/
                          {selectedKegiatan.maxParticipants} orang
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: "#fafafa",
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  calendar: {
    borderRadius: 12,
  },
  legendContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  emptyState: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  kegiatanListContainer: {
    gap: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  kegiatanCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    lineHeight: 22,
  },
  cardMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  modalBody: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 24,
  },
  detailsSection: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  bottomSpace: {
    height: 40,
  },
});
