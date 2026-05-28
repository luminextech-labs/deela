import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { CATEGORIES, DEALS, TRENDING } from '../data/mockData';
import CategoryItem from '../components/CategoryItem';
import DealCard from '../components/DealCard';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoDee}>dee</Text>
          <Text style={styles.logoLa}>la</Text>
        </Text>
        <TouchableOpacity style={styles.notifyBtn}>
          <Text style={styles.notifyIcon}>🔔</Text>
          <View style={styles.notifyDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาสินค้า เช่น หูฟัง, iPhone, โต๊ะทำงาน"
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </ScrollView>

      {/* Hero Banner */}
      <TouchableOpacity
        style={styles.heroBanner}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Search')}
      >
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>ค้นครั้งเดียว</Text>
            <Text style={styles.heroHighlight}>เจอของคุ้มสุด</Text>
            <Text style={styles.heroTitle}>ทุกแพลตฟอร์ม</Text>
            <Text style={styles.heroSub}>เปรียบเทียบราคาและรีวิวจาก Shopee Lazada TikTok Shop</Text>
          </View>
          <View style={styles.heroRobot}>
            <Text style={styles.robotEmoji}>🤖</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Daily Deals */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 ดีลน่าช้อปวันนี้</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>ดูทั้งหมด →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dealsScroll}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {DEALS.map((deal) => (
          <DealCard key={deal.id} deal={deal} onPress={() => navigation.navigate('Product', { product: deal })} />
        ))}
      </ScrollView>

      {/* Trending */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📈 สินค้ากำลังมาแรง</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>ดูทั้งหมด →</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.trendingList}>
        {TRENDING.map((item) => (
          <TouchableOpacity
            key={item.rank}
            style={styles.trendingItem}
            onPress={() => navigation.navigate('Search')}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingName}>{item.name}</Text>
            </View>
            <Text style={styles.trendingPrice}>฿{item.price.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom padding */}
      <View style={{ height: 20 }} />
    </ScrollView>
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
  logoText: { fontSize: 24, fontWeight: '700' },
  logoDee: { color: COLORS.charcoal },
  logoLa: {
    color: COLORS.purple,
  },
  notifyBtn: { marginLeft: 'auto', position: 'relative' },
  notifyIcon: { fontSize: 22 },
  notifyDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  categoriesScroll: { marginTop: 14 },
  categoriesContent: { paddingHorizontal: 16, gap: 10 },
  heroBanner: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, overflow: 'hidden' },
  heroGradient: {
    flexDirection: 'row',
    padding: 24,
    minHeight: 120,
  },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white, lineHeight: 28 },
  heroHighlight: {
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#FFD700',
    -webkit-background-clip: 'text',
    -webkit-text-fill-color: 'transparent',
  },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 18 },
  heroRobot: { fontSize: 56, alignSelf: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.charcoal },
  viewAll: { marginLeft: 'auto', fontSize: 12, color: COLORS.purple, fontWeight: '600' },
  dealsScroll: {},
  trendingList: { paddingHorizontal: 16, gap: 8 },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 10,
    marginBottom: 2,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  trendingInfo: { flex: 1 },
  trendingName: { fontSize: 13, fontWeight: '500', color: COLORS.textDark },
  trendingPrice: { fontSize: 12, color: COLORS.red, fontWeight: '600' },
});