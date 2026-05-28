import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>👤 โปรไฟล์</Text>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Nattawat</Text>
          <Text style={styles.profileEmail}>nattawat@deela.app</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.editBtn}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Menu items */}
      <View style={styles.menuSection}>
        {[
          { icon: '📦', label: 'คำสั่งซื้อของฉัน', sub: 'ติดตามและดูประวัติการสั่งซื้อ' },
          { icon: '❤️', label: 'สินค้าที่บันทึกไว้', sub: 'รายการสินค้าที่ถูกใจ' },
          { icon: '🔔', label: 'แจ้งเตือนราคา', sub: 'ดูรายการแจ้งเตือนทั้งหมด' },
          { icon: '⚙️', label: 'ตั้งค่า', sub: 'การแจ้งเตือน ภาษา บัญชี' },
          { icon: '❓', label: 'ช่วยเหลือ', sub: 'คำถามที่พบบ่อย ติดต่อเรา' },
          { icon: '📱', label: 'เกี่ยวกับ Deela', sub: 'เวอร์ชัน 1.0.0' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, paddingTop: 20 },
  screenTitle: { fontSize: 20, fontWeight: '700', color: COLORS.charcoal },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  profileInfo: { flex: 1, marginLeft: 14 },
  profileName: { fontSize: 16, fontWeight: '600', color: COLORS.charcoal },
  profileEmail: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  editBtn: { fontSize: 18 },
  menuSection: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '500', color: COLORS.charcoal },
  menuSub: { fontSize: 11, color: COLORS.textGray, marginTop: 1 },
  menuArrow: { fontSize: 20, color: COLORS.textLight },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.red, fontSize: 14, fontWeight: '600' },
});