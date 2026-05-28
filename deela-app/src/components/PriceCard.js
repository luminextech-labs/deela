import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function PriceCard({ platform, onPress }) {
  const platformColors = {
    Shopee: COLORS.shopee,
    Lazada: COLORS.lazada,
    'TikTok Shop': COLORS.tiktok,
  };

  const shortNames = {
    Shopee: 'ชีปี้',
    Lazada: 'ลาซาด้า',
    'TikTok Shop': 'ติ๊กต๊อก',
  };

  const color = platformColors[platform.name] || COLORS.charcoal;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.logoBox, { backgroundColor: color }]}>
        <Text style={styles.logoText}>
          {platform.name === 'Shopee' ? 'ซ' : platform.name === 'Lazada' ? 'ล' : 'ต'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color }]}>{platform.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>฿{platform.price.toLocaleString()}</Text>
          <Text style={styles.original}>฿{platform.originalPrice.toLocaleString()}</Text>
          <View style={styles.discBadge}>
            <Text style={styles.discText}>-{platform.discount}%</Text>
          </View>
        </View>
        {platform.shipping === 'ฟรี' && (
          <Text style={styles.freeShipping}>✓ ฟรีส่ง</Text>
        )}
      </View>
      <TouchableOpacity style={[styles.gotoBtn, { backgroundColor: color }]}>
        <Text style={styles.gotoBtnText}>ไปที่ร้าน</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 8,
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  info: { flex: 1, marginLeft: 8 },
  name: { fontSize: 13, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  original: { fontSize: 11, color: COLORS.textLight, textDecorationLine: 'line-through' },
  discBadge: {
    backgroundColor: COLORS.red,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  discText: { color: COLORS.white, fontSize: 10, fontWeight: '600' },
  freeShipping: { fontSize: 10, color: COLORS.teal, fontWeight: '600', marginTop: 2 },
  gotoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  gotoBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
});