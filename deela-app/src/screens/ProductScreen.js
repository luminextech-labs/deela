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
import { PRODUCTS } from '../data/mockData';
import PriceCard from '../components/PriceCard';
import PriceChart from '../components/PriceChart';

export default function ProductScreen({ route, navigation }) {
  const { product: initialProduct } = route.params || {};
  const product = initialProduct || PRODUCTS[0];
  const [alertPrice, setAlertPrice] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.iconBtnOutline]}>
            <Text>↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageArea}>
          <Text style={styles.productEmoji}>{product.emoji}</Text>
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        </View>

        {/* Best Price Banner */}
        <View style={styles.priceBanner}>
          <View>
            <Text style={styles.priceBannerLabel}>ราคาที่ดีที่สุด</Text>
            <Text style={styles.priceBannerPrice}>฿{product.price.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.shopeeBtn}>
            <Text style={styles.shopeeBtnText}>ไปที่ Shopee →</Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productMeta}>⭐ {product.rating} ({product.reviews} รีวิว) · ยอดขาย {product.sales.toLocaleString()} ชิ้น</Text>
        </View>

        {/* AI Summary */}
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIcon}>
              <Text style={{ fontSize: 14 }}>🤖</Text>
            </View>
            <Text style={styles.aiLabel}>AI สรุปรีวิว</Text>
          </View>
          <View style={styles.aiPros}>
            {product.aiSummary.pros.map((pro, i) => (
              <View key={i} style={styles.aiPoint}>
                <View style={[styles.aiBullet, styles.aiBulletPlus]}>
                  <Text style={styles.aiBulletText}>✓</Text>
                </View>
                <Text style={styles.aiPointText}>{pro}</Text>
              </View>
            ))}
          </View>
          <View style={styles.aiCons}>
            {product.aiSummary.cons.map((con, i) => (
              <View key={i} style={styles.aiPoint}>
                <View style={[styles.aiBullet, styles.aiBulletMinus]}>
                  <Text style={styles.aiBulletTextRed}>✗</Text>
                </View>
                <Text style={styles.aiPointText}>{con}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price Comparison */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💰 เปรียบเทียบราคา</Text>
        </View>
        <View style={styles.priceCards}>
          {product.platforms.map((p, i) => (
            <PriceCard key={i} platform={p} />
          ))}
        </View>

        {/* Price History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📊 ประวัติราคา 30 วัน</Text>
        </View>
        <View style={styles.chartBox}>
          <PriceChart history={product.priceHistory} />
          <View style={styles.alertRow}>
            <TextInput
              style={styles.alertInput}
              placeholder="ตั้งราคาที่ต้องการ..."
              placeholderTextColor={COLORS.textLight}
              value={alertPrice}
              onChangeText={setAlertPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.alertBtn}>
              <Text style={styles.alertBtnText}>🔔 ตั้งแจ้งเตือน</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Comparison */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 เปรียบเทียบข้อมูล</Text>
        </View>
        <View style={styles.dataTable}>
          {[
            { label: 'ราคา', values: product.platforms.map(p => `฿${p.price.toLocaleString()}`), highlight: 0 },
            { label: 'ค่าส่ง', values: product.platforms.map(p => p.shipping), isFree: [0, 2] },
            { label: 'คะแนนร้าน', values: ['⭐4.8', '4.6', '4.5'] },
            { label: 'รีวิว', values: ['1.2พัน', '850', '620'] },
            { label: 'ยอดขาย', values: ['2,350', '1,820', '940'] },
            { label: 'รับประกัน', values: ['6 เดือน', '3 เดือน', 'ไม่มี'] },
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.dataRow}>
              <Text style={styles.dataLabel}>{row.label}</Text>
              <View style={styles.dataValues}>
                {row.values.map((val, colIndex) => {
                  const isHighlight = row.highlight === colIndex;
                  const isFree = row.isFree && row.isFree.includes(colIndex);
                  return (
                    <Text
                      key={colIndex}
                      style={[
                        styles.dataCell,
                        isHighlight && styles.dataCellHighlight,
                        isFree && styles.dataCellFree,
                        colIndex === 0 && row.highlight === undefined && styles.dataCellRed,
                      ]}
                    >
                      {val}
                    </Text>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: COLORS.charcoal },
  headerActions: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnOutline: { borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: COLORS.white },
  imageArea: {
    height: 200,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productEmoji: { fontSize: 72 },
  discountTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.red,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  priceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.shopee,
  },
  priceBannerLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  priceBannerPrice: { fontSize: 24, fontWeight: '700', color: COLORS.white },
  shopeeBtn: {
    marginLeft: 'auto',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
  },
  shopeeBtnText: { color: COLORS.shopee, fontSize: 12, fontWeight: '700' },
  productInfo: { padding: 16 },
  productName: { fontSize: 16, fontWeight: '600', color: COLORS.charcoal, lineHeight: 24 },
  productMeta: { fontSize: 12, color: COLORS.textGray, marginTop: 4 },
  aiBox: {
    marginHorizontal: 16,
    backgroundColor: '#FAF8FF',
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
    borderRadius: 16,
    padding: 14,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.purple,
  },
  aiPros: { gap: 7 },
  aiCons: { gap: 7, marginTop: 8 },
  aiPoint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBulletPlus: { backgroundColor: '#D1FAE5' },
  aiBulletMinus: { backgroundColor: '#FEE2E2' },
  aiBulletText: { fontSize: 10, color: COLORS.teal, fontWeight: '700' },
  aiBulletTextRed: { fontSize: 10, color: COLORS.red, fontWeight: '700' },
  aiPointText: { fontSize: 12, color: COLORS.textDark, lineHeight: 18 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.charcoal },
  priceCards: { paddingHorizontal: 16 },
  chartBox: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 14,
  },
  alertRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  alertInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  alertBtn: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  dataTable: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  dataLabel: {
    width: 90,
    padding: 10,
    fontSize: 11,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  dataValues: { flex: 1, flexDirection: 'row' },
  dataCell: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    color: COLORS.textDark,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.cardBorder,
  },
  dataCellHighlight: { color: COLORS.teal, fontWeight: '600' },
  dataCellFree: { color: COLORS.teal, fontWeight: '600' },
  dataCellRed: { color: COLORS.red, fontWeight: '600' },
});