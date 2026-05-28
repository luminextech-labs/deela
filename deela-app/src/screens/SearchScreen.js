import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS } from '../theme/colors';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';

const FILTERS = ['คุ้มสุด', 'ราคาถูกสุด', 'รีวิวดีที่สุด', 'ยอดขายสูงสุด'];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('คุ้มสุด');

  return (
    <View style={styles.container}>
      {/* Search header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ผลการค้นหา: หูฟังบลูทูธ"
            placeholderTextColor={COLORS.textGray}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabs}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, filter === activeFilter && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === activeFilter && styles.filterTabTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => navigation.navigate('Product', { product })}
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    gap: 10,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 20, color: COLORS.charcoal },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    paddingHorizontal: 14,
    height: 42,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: { fontSize: 14 },
  filterTabs: { paddingHorizontal: 16, paddingBottom: 14, gap: 8 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
  },
  filterTabText: { fontSize: 12, fontWeight: '500', color: COLORS.textDark },
  filterTabTextActive: { color: COLORS.white },
  results: { flex: 1, paddingHorizontal: 16 },
});