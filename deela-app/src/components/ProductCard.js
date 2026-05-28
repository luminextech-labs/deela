import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.imageArea}>
          <Text style={styles.emoji}>{product.emoji}</Text>
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>คุ้มสุด</Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.rating}>⭐ {product.rating} ({product.reviews} รีวิว)</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>฿{product.price.toLocaleString()}</Text>
            <Text style={styles.original}>฿{product.originalPrice.toLocaleString()}</Text>
            <Text style={styles.discount}>-{product.discount}%</Text>
          </View>
          <View style={styles.compareRow}>
            {product.platforms && product.platforms.map((p, i) => (
              <View key={i} style={[styles.pcTag, { borderColor: p.color }]}>
                <Text style={[styles.pcTagText, { color: p.color }]}>
                  {p.name === 'Shopee' ? 'ชีปี้' : p.name === 'Lazada' ? 'ลาซาด้า' : 'ติ๊กต๊อก'} ฿{p.price}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', padding: 14, gap: 14 },
  imageArea: {
    width: 95,
    height: 95,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 38 },
  discountTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.red,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
  },
  info: { flex: 1, gap: 4 },
  badgeRow: { flexDirection: 'row' },
  badge: {
    backgroundColor: COLORS.purple,
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
    lineHeight: 18,
  },
  rating: { fontSize: 11, color: COLORS.textGray },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 2 },
  price: { fontSize: 18, fontWeight: '700', color: COLORS.red },
  original: { fontSize: 12, color: COLORS.textLight, textDecorationLine: 'line-through' },
  discount: { fontSize: 11, color: COLORS.red, fontWeight: '600' },
  compareRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  pcTag: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pcTagText: { fontSize: 10, fontWeight: '500' },
});