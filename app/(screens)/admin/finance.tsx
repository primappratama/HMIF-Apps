import { useAuth } from "@/context/AuthContext";
import {
  createTransaction,
  deleteTransaction,
  FinanceTransaction,
  getAllTransactions,
  getFinanceSummary,
  updateTransaction,
} from "@/services/finance.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { value: "Iuran", label: "Iuran" },
  { value: "Sponsorship", label: "Sponsorship" },
  { value: "Acara", label: "Acara" },
  { value: "Operasional", label: "Operasional" },
  { value: "Lainnya", label: "Lainnya" },
];

export default function FinanceManagementScreen() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<FinanceTransaction | null>(null);

  // Summary
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Iuran");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadSummary();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const summary = await getFinanceSummary();
      setTotalIncome(summary.totalIncome);
      setTotalExpense(summary.totalExpense);
      setBalance(summary.balance);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const handleAddTransaction = () => {
    setEditMode(false);
    setSelectedTransaction(null);
    setTitle("");
    setAmount("");
    setType("income");
    setCategory("Iuran");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setModalVisible(true);
  };

  const handleEditTransaction = (transaction: FinanceTransaction) => {
    setEditMode(true);
    setSelectedTransaction(transaction);
    setTitle(transaction.title);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date);
    setModalVisible(true);
  };

  const handleSaveTransaction = async () => {
    if (!title.trim() || !amount.trim() || !date.trim()) {
      Alert.alert("Error", "Judul, nominal, dan tanggal harus diisi");
      return;
    }

    const numAmount = parseInt(amount.replace(/\D/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Nominal harus berupa angka positif");
      return;
    }

    setSaving(true);

    try {
      if (editMode && selectedTransaction) {
        await updateTransaction(selectedTransaction.id, {
          title,
          amount: numAmount,
          type,
          category,
          description,
          date,
        });
        Alert.alert("Sukses", "Transaksi berhasil diupdate");
      } else {
        await createTransaction(
          title,
          numAmount,
          type,
          category,
          description,
          date,
          user?.name || "Admin"
        );
        Alert.alert("Sukses", "Transaksi berhasil ditambahkan");
      }

      setModalVisible(false);
      loadTransactions();
      loadSummary();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = (transaction: FinanceTransaction) => {
    Alert.alert(
      "Hapus Transaksi",
      "Apakah Anda yakin ingin menghapus transaksi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              Alert.alert("Sukses", "Transaksi berhasil dihapus");
              loadTransactions();
              loadSummary();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus transaksi");
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatCurrencyShort = (num: number) => {
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1)}jt`;
    } else if (num >= 1000) {
      return `Rp ${(num / 1000).toFixed(0)}rb`;
    }
    return formatCurrency(num);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color="#ccc" />
          <Text style={styles.errorText}>Akses ditolak</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Memuat transaksi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View
              style={[styles.summaryIconBox, { backgroundColor: "#E8F5E9" }]}
            >
              <Ionicons name="trending-down" size={20} color="#00C853" />
            </View>
            <Text style={styles.summaryLabel}>Pemasukan</Text>
          </View>
          <Text style={[styles.summaryValue, { color: "#00C853" }]}>
            {formatCurrencyShort(totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View
              style={[styles.summaryIconBox, { backgroundColor: "#FFEBEE" }]}
            >
              <Ionicons name="trending-up" size={20} color="#FF3B30" />
            </View>
            <Text style={styles.summaryLabel}>Pengeluaran</Text>
          </View>
          <Text style={[styles.summaryValue, { color: "#FF3B30" }]}>
            {formatCurrencyShort(totalExpense)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View
              style={[styles.summaryIconBox, { backgroundColor: "#E3F2FD" }]}
            >
              <Ionicons name="wallet" size={20} color="#007AFF" />
            </View>
            <Text style={styles.summaryLabel}>Saldo</Text>
          </View>
          <Text
            style={[
              styles.summaryValue,
              { color: balance >= 0 ? "#007AFF" : "#FF3B30" },
            ]}
          >
            {formatCurrencyShort(balance)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transactions List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTransaction}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada transaksi</Text>
              <Text style={styles.emptySubtext}>
                Tap tombol Tambah untuk membuat transaksi baru
              </Text>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  {/* Left Section */}
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIconBox,
                        {
                          backgroundColor:
                            transaction.type === "income"
                              ? "#E8F5E9"
                              : "#FFEBEE",
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          transaction.type === "income"
                            ? "arrow-down"
                            : "arrow-up"
                        }
                        size={18}
                        color={
                          transaction.type === "income" ? "#00C853" : "#FF3B30"
                        }
                      />
                    </View>

                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle} numberOfLines={1}>
                        {transaction.title}
                      </Text>
                      <View style={styles.transactionMeta}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>
                            {transaction.category}
                          </Text>
                        </View>
                        <Text style={styles.transactionDate}>
                          {formatDate(transaction.date)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Section */}
                  <View style={styles.transactionRight}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.type === "income"
                              ? "#00C853"
                              : "#FF3B30",
                        },
                      ]}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrencyShort(transaction.amount)}
                    </Text>

                    <View style={styles.transactionActions}>
                      <TouchableOpacity
                        onPress={() => handleEditTransaction(transaction)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#007AFF"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(transaction)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#FF3B30"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? "Edit Transaksi" : "Tambah Transaksi"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Type Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Jenis Transaksi</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === "income" && styles.typeButtonIncome,
                    ]}
                    onPress={() => setType("income")}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="trending-down"
                      size={18}
                      color={type === "income" ? "#fff" : "#666"}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === "income" && styles.typeButtonTextActive,
                      ]}
                    >
                      Pemasukan
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === "expense" && styles.typeButtonExpense,
                    ]}
                    onPress={() => setType("expense")}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="trending-up"
                      size={18}
                      color={type === "expense" ? "#fff" : "#666"}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === "expense" && styles.typeButtonTextActive,
                      ]}
                    >
                      Pengeluaran
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Judul Transaksi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Iuran Bulanan Desember"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nominal</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencySymbol}>Rp</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    value={amount}
                    onChangeText={(text) => {
                      const num = text.replace(/\D/g, "");
                      setAmount(
                        num ? parseInt(num).toLocaleString("id-ID") : ""
                      );
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryChip,
                        category === cat.value && styles.categoryChipActive,
                      ]}
                      onPress={() => setCategory(cat.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          category === cat.value &&
                            styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tanggal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024-12-25"
                  value={date}
                  onChangeText={setDate}
                />
                <Text style={styles.inputHint}>Format: YYYY-MM-DD</Text>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tambahkan catatan atau detail transaksi"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveTransaction}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editMode ? "Update Transaksi" : "Simpan Transaksi"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  transactionList: {
    gap: 10,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  transactionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  transactionDate: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  transactionActions: {
    flexDirection: "row",
    gap: 6,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#000",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  textArea: {
    minHeight: 100,
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  typeButtonIncome: {
    backgroundColor: "#00C853",
    borderColor: "#00C853",
  },
  typeButtonExpense: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  categoryChipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bottomSpace: {
    height: 40,
  },
});
