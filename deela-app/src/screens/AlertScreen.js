import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../theme/colors';

const ALERTS = [
  { id: '1', name: 'หูฟังบลูทูธ Anker Soundcore P20i', targetPrice: 600, currentPrice: 690, emoji: '🎧' },
  { id: '2', name: 'iPhone 15 128GB', targetPrice: 25000, currentPrice: 27900, emoji: '📱' },
];

export default function AlertScreen({ navigation }) {
  const [price, setPrice] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🔔 แจ้งเตือนราคา</Text>
      </View>

      {/* Set alert */}
      <View style={styles.setAlertCard}>
        <Text style={styles.setAlertTitle}>ตั้งแจ้งเตือนราคาใหม่</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.priceInput}
            placeholder="ราคาที่ต้องการ..."
            placeholderTextColor={COLORS.textLight}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active alerts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📌 การแจ้งเตือนที่ใช้อยู่</Text>
      </View>

      {ALERTS.map((alert) => {
        const dropped = alert.currentPrice <= alert.targetPrice;
        return (
          <View key={alert.id} style={[styles.alertCard, dropped && styles.alertCardSuccess]}>
            <View style={styles.alertInfo}>
              <Text style={styles.alertEmoji}>{alert.emoji}</Text>
              <View style={styles.alertDetails}>
                <Text style={styles.alertName} numberOfLines={1}>{alert.name}</Text>
                {!dropped ? (
                  <Text style={styles.alertStatus}>
                    ราคาปัจจุบัน: ฿{alert.currentPrice.toLocaleString()} | เป้า: ฿{alert.targetPrice.toLocaleString()}
                  </Text>
                ) : (
                  <Text style={styles.alertSuccess}>✓ ราคาต่ำกว่าเป้าแล้ว!</Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={[styles.deleteBtn, dropped && styles.deleteBtnSuccess]}>
              <Text style={styles.deleteBtnText}>🗑</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, paddingTop: 20 },
  screenTitle: { fontSize: 20, fontWeight: '700', color: COLORS.charcoal },
  setAlertCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  setAlertTitle: { fontSize: 14, fontWeight: '600', color: COLORS.charcoal, marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 10 },
  priceInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.charcoal,
  },
  saveBtn: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.charcoal },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  alertCardSuccess: {
    borderColor: COLORS.teal,
    backgroundColor: '#F0FDF4',
  },
  alertInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertEmoji: { fontSize: 32 },
  alertDetails: { flex: 1 },
  alertName: { fontSize: 13, fontWeight: '500', color: COLORS.charcoal },
  alertStatus: { fontSize: 11, color: COLORS.textGray, marginTop: 2 },
  alertSuccess: { fontSize: 11, color: COLORS.teal, fontWeight: '600', marginTop: 2 },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnSuccess: { backgroundColor: '#D1FAE5' },
  deleteBtnText: { fontSize: 14 },
});