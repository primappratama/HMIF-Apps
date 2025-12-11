import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type PeriodType = 'bulanan' | 'semester' | 'tahunan';
type TransactionType = 'all' | 'income' | 'expense';

// Mock data keuangan
const financialSummary = {
  balance: 15750000,
  income: 28500000,
  expense: 12750000,
};

// Mock data transaksi
const transactions = [
  {
    id: '1',
    date: '2024-12-10',
    description: 'Iuran Anggota Periode Desember',
    amount: 5000000,
    type: 'income' as const,
    category: 'Iuran',
  },
  {
    id: '2',
    date: '2024-12-08',
    description: 'Pembelian Konsumsi Workshop AI',
    amount: 2500000,
    type: 'expense' as const,
    category: 'Kegiatan',
  },
  {
    id: '3',
    date: '2024-12-05',
    description: 'Sponsor dari PT. Tech Indonesia',
    amount: 10000000,
    type: 'income' as const,
    category: 'Sponsor',
  },
  {
    id: '4',
    date: '2024-12-03',
    description: 'Sewa Tempat Seminar Nasional',
    amount: 5000000,
    type: 'expense' as const,
    category: 'Operasional',
  },
  {
    id: '5',
    date: '2024-11-28',
    description: 'Iuran Anggota Periode November',
    amount: 4800000,
    type: 'income' as const,
    category: 'Iuran',
  },
  {
    id: '6',
    date: '2024-11-25',
    description: 'Pembelian Perlengkapan LDK',
    amount: 3500000,
    type: 'expense' as const,
    category: 'Kegiatan',
  },
  {
    id: '7',
    date: '2024-11-20',
    description: 'Donasi Alumni Angkatan 2019',
    amount: 7500000,
    type: 'income' as const,
    category: 'Donasi',
  },
  {
    id: '8',
    date: '2024-11-15',
    description: 'Cetak Sertifikat Workshop',
    amount: 1750000,
    type: 'expense' as const,
    category: 'Operasional',
  },
];

export default function FinanceScreen() {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('bulanan');
  const [activeFilter, setActiveFilter] = useState<TransactionType>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getFilteredTransactions = () => {
    if (activeFilter === 'all') return transactions;
    return transactions.filter(t => t.type === activeFilter);
  };

  const renderTransaction = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.transactionCard} activeOpacity={0.7}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: item.type === 'income' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Ionicons
            name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
            size={18}
            color={item.type === 'income' ? '#00C853' : '#FF3B30'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
            <View style={styles.dot} />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'income' ? '#00C853' : '#FF3B30' }
      ]}>
        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Filter */}
        <View style={styles.periodContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodContent}
          >
            {(['bulanan', 'semester', 'tahunan'] as PeriodType[]).map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.periodButton, activePeriod === period && styles.periodButtonActive]}
                onPress={() => setActivePeriod(period)}
                activeOpacity={0.7}
              >
                <Text style={[styles.periodText, activePeriod === period && styles.periodTextActive]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Balance Card */}
        <View style={styles.summaryContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Saldo</Text>
              <View style={styles.balanceBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#00C853" />
                <Text style={styles.balanceBadgeText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.balanceAmount}>{formatCurrency(financialSummary.balance)}</Text>
            <View style={styles.balanceFooter}>
              <Text style={styles.balanceDate}>Update: {new Date().toLocaleDateString('id-ID')}</Text>
            </View>
          </View>

          {/* Income & Expense Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <View style={[styles.summaryCardIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="trending-up" size={18} color="#00C853" />
                </View>
                <Text style={styles.summaryCardLabel}>Pemasukan</Text>
              </View>
              <Text style={[styles.summaryCardAmount, { color: '#00C853' }]}>
                {formatCurrency(financialSummary.income)}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <View style={[styles.summaryCardIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="trending-down" size={18} color="#FF3B30" />
                </View>
                <Text style={styles.summaryCardLabel}>Pengeluaran</Text>
              </View>
              <Text style={[styles.summaryCardAmount, { color: '#FF3B30' }]}>
                {formatCurrency(financialSummary.expense)}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaksi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('all')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                Semua
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'income' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('income')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-down" 
                size={12} 
                color={activeFilter === 'income' ? '#fff' : '#666'} 
              />
              <Text style={[styles.filterText, activeFilter === 'income' && styles.filterTextActive]}>
                Masuk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'expense' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('expense')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-up" 
                size={12} 
                color={activeFilter === 'expense' ? '#fff' : '#666'} 
              />
              <Text style={[styles.filterText, activeFilter === 'expense' && styles.filterTextActive]}>
                Keluar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {getFilteredTransactions().map(renderTransaction)}
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  periodContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  periodContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  periodButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  balanceCard: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.7,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  balanceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -1,
  },
  balanceFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  balanceDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  summaryCardAmount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  transactionsList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ccc',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginLeft: 8,
  },
  bottomSpace: {
    height: 20,
  },
});