import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

const { width } = Dimensions.get("window");

type PeriodType = "bulanan" | "semester" | "tahunan";
type FilterType = "semua" | "pemasukan" | "pengeluaran";

type Transaction = {
  id: string;
  type: "pemasukan" | "pengeluaran";
  category: string;
  amount: number;
  date: string;
  description: string;
};

const transactionsData: Transaction[] = [
  {
    id: "1",
    type: "pemasukan",
    category: "Iuran Anggota",
    amount: 5000000,
    date: "10 Des 2024",
    description: "Iuran bulanan anggota HMIF",
  },
  {
    id: "2",
    type: "pengeluaran",
    category: "Kegiatan",
    amount: 2500000,
    date: "8 Des 2024",
    description: "Workshop React Native",
  },
  {
    id: "3",
    type: "pemasukan",
    category: "Sponsorship",
    amount: 3000000,
    date: "5 Des 2024",
    description: "Sponsor acara seminar",
  },
  {
    id: "4",
    type: "pengeluaran",
    category: "Operasional",
    amount: 1000000,
    date: "3 Des 2024",
    description: "Pembelian perlengkapan kantor",
  },
  {
    id: "5",
    type: "pengeluaran",
    category: "Kegiatan",
    amount: 1500000,
    date: "1 Des 2024",
    description: "Seminar AI & Machine Learning",
  },
  {
    id: "6",
    type: "pemasukan",
    category: "Donasi",
    amount: 2000000,
    date: "28 Nov 2024",
    description: "Donasi dari alumni",
  },
  {
    id: "7",
    type: "pengeluaran",
    category: "Konsumsi",
    amount: 800000,
    date: "25 Nov 2024",
    description: "Konsumsi rapat pengurus",
  },
];

// Chart data
const incomeData = [
  {
    category: "Iuran Anggota",
    amount: 5000000,
    percentage: 62.5,
    color: "#007AFF",
  },
  {
    category: "Sponsorship",
    amount: 3000000,
    percentage: 37.5,
    color: "#00C853",
  },
];

const expenseData = [
  { category: "Kegiatan", amount: 4000000, percentage: 80, color: "#FF9500" },
  {
    category: "Operasional",
    amount: 1000000,
    percentage: 20,
    color: "#FF3B30",
  },
];

export default function FinanceScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("bulanan");
  const [filterType, setFilterType] = useState<FilterType>("semua");

  const totalSaldo = 15000000;
  const totalPemasukan = 8000000;
  const totalPengeluaran = 5000000;
  const percentageChange = "+18.5%";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}jt`;
    }
    return formatCurrency(amount);
  };

  const getFilteredTransactions = () => {
    if (filterType === "semua") return transactionsData;
    return transactionsData.filter((t) => t.type === filterType);
  };

  const renderDonutChart = (
    data: typeof incomeData,
    total: number,
    title: string
  ) => {
    const size = 160;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const center = size / 2;

    let currentAngle = -90; // Start from top

    return (
      <View style={styles.donutChartContainer}>
        <Text style={styles.donutTitle}>{title}</Text>

        <View style={styles.donutChart}>
          <Svg width={size} height={size}>
            <G rotation={0} origin={`${center}, ${center}`}>
              {/* Background circle */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#f0f0f0"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Data segments */}
              {data.map((item, index) => {
                const percentage = item.percentage;
                const strokeDashoffset =
                  circumference - (circumference * percentage) / 100;
                const rotation = currentAngle;

                currentAngle += (percentage / 100) * 360;

                return (
                  <Circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                    strokeLinecap="round"
                    rotation={rotation}
                    origin={`${center}, ${center}`}
                  />
                );
              })}
            </G>
          </Svg>

          {/* Center text */}
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterAmount}>
              {formatShortCurrency(total)}
            </Text>
            <Text style={styles.donutCenterLabel}>Total</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.donutLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.donutLegendItem}>
              <View
                style={[styles.donutLegendDot, { backgroundColor: item.color }]}
              />
              <View style={styles.donutLegendContent}>
                <Text style={styles.donutLegendText}>{item.category}</Text>
                <Text style={styles.donutLegendAmount}>
                  {formatShortCurrency(item.amount)} ({item.percentage}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Saldo Card */}
        <View style={styles.saldoCard}>
          <View style={styles.saldoHeader}>
            <Text style={styles.saldoLabel}>Total Saldo</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#00C853" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.saldoAmount}>{formatCurrency(totalSaldo)}</Text>
          <View style={styles.changeIndicator}>
            <Ionicons name="trending-up" size={16} color="#00C853" />
            <Text style={styles.changeText}>
              {percentageChange} vs bulan lalu
            </Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.pemasukanCard]}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="arrow-down" size={20} color="#00C853" />
              </View>
              <Ionicons name="trending-up" size={16} color="#00C853" />
            </View>
            <Text style={styles.summaryLabel}>Pemasukan</Text>
            <Text style={[styles.summaryAmount, { color: "#00C853" }]}>
              {formatCurrency(totalPemasukan)}
            </Text>
            <Text style={styles.summarySubtext}>Bulan ini</Text>
          </View>

          <View style={[styles.summaryCard, styles.pengeluaranCard]}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="arrow-up" size={20} color="#FF3B30" />
              </View>
              <Ionicons name="trending-down" size={16} color="#FF3B30" />
            </View>
            <Text style={styles.summaryLabel}>Pengeluaran</Text>
            <Text style={[styles.summaryAmount, { color: "#FF3B30" }]}>
              {formatCurrency(totalPengeluaran)}
            </Text>
            <Text style={styles.summarySubtext}>Bulan ini</Text>
          </View>
        </View>

        {/* Donut Charts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakdown Keuangan</Text>

          <View style={styles.chartsGrid}>
            {renderDonutChart(incomeData, totalPemasukan, "Pemasukan")}
            {renderDonutChart(expenseData, totalPengeluaran, "Pengeluaran")}
          </View>
        </View>

        {/* Period Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>

          <View style={styles.periodFilter}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "bulanan" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("bulanan")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "bulanan" && styles.periodTextActive,
                ]}
              >
                Bulanan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "semester" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("semester")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "semester" && styles.periodTextActive,
                ]}
              >
                Semester
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "tahunan" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("tahunan")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "tahunan" && styles.periodTextActive,
                ]}
              >
                Tahunan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transaction Filter */}
          <View style={styles.transactionFilter}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "semua" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("semua")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterType === "semua" && styles.filterChipTextActive,
                ]}
              >
                Semua
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "pemasukan" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("pemasukan")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-down"
                size={14}
                color={filterType === "pemasukan" ? "#fff" : "#00C853"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filterType === "pemasukan" && styles.filterChipTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "pengeluaran" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("pengeluaran")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-up"
                size={14}
                color={filterType === "pengeluaran" ? "#fff" : "#FF3B30"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filterType === "pengeluaran" && styles.filterChipTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {getFilteredTransactions().map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === "pemasukan"
                      ? styles.iconPemasukan
                      : styles.iconPengeluaran,
                  ]}
                >
                  <Ionicons
                    name={
                      transaction.type === "pemasukan"
                        ? "arrow-down"
                        : "arrow-up"
                    }
                    size={20}
                    color={
                      transaction.type === "pemasukan" ? "#00C853" : "#FF3B30"
                    }
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === "pemasukan"
                    ? styles.amountPemasukan
                    : styles.amountPengeluaran,
                ]}
              >
                {transaction.type === "pemasukan" ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
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
  saldoCard: {
    backgroundColor: "#000",
    margin: 24,
    padding: 24,
    borderRadius: 20,
  },
  saldoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  saldoLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 200, 83, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00C853",
  },
  saldoAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: -1,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#00C853",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  pemasukanCard: {
    backgroundColor: "#F0FFF4",
    borderColor: "#C8E6C9",
  },
  pengeluaranCard: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FFCDD2",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 11,
    color: "#999",
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  chartsGrid: {
    gap: 24,
  },
  donutChartContainer: {
    backgroundColor: "#fafafa",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  donutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  donutChart: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenterAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  donutCenterLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  donutLegend: {
    gap: 12,
  },
  donutLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  donutLegendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  donutLegendContent: {
    flex: 1,
  },
  donutLegendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  donutLegendAmount: {
    fontSize: 12,
    color: "#666",
  },
  periodFilter: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  periodButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  periodText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  periodTextActive: {
    color: "#fff",
  },
  transactionFilter: {
    flexDirection: "row",
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  transactionsList: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPemasukan: {
    backgroundColor: "#E8F5E9",
  },
  iconPengeluaran: {
    backgroundColor: "#FFEBEE",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  amountPemasukan: {
    color: "#00C853",
  },
  amountPengeluaran: {
    color: "#FF3B30",
  },
  bottomSpace: {
    height: 40,
  },
});
