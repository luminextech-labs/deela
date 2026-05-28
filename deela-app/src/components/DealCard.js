import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function DealCard({ deal, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageArea}>
        <Text style={styles.emoji}>{deal.emoji}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{deal.discount}%</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.price}>฿{deal.price.toLocaleString()}</Text>
        <Text style={styles.original}>฿{deal.originalPrice.toLocaleString()}</Text>
        <Text style={styles.platform}>{deal.platform}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageArea: {
    height: 110,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 44 },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: COLORS.red,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  body: { padding: 10 },
  price: { fontSize: 15, fontWeight: '700', color: COLORS.red },
  original: { fontSize: 11, color: COLORS.textLight, textDecorationLine: 'line-through' },
  platform: { fontSize: 10, color: COLORS.textGray, marginTop: 3 },
});