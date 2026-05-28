import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function CategoryItem({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 60,
    marginRight: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textDark,
    marginTop: 5,
    textAlign: 'center',
  },
});