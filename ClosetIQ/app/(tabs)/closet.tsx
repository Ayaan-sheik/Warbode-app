import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ClosetItem } from '../../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Footwear',
  'Accessories',
];

export default function ClosetScreen() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadClosetItems();
  }, []);

  const loadClosetItems = async () => {
    try {
      // Check for demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      const user = auth.currentUser;
      if (!user && !isDemoMode) {
        router.replace('/(auth)/login');
        return;
      }
      
      // For demo mode, show sample data
      if (isDemoMode && !user) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Fixed: Use correct collection name
      const q = query(
        collection(db, 'closet_items'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ClosetItem[];

      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load closet items');
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Moved filtering logic inline
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = async (itemId: string, currentState: boolean) => {
    // Favorite functionality to be implemented
    Alert.alert('Coming Soon', 'Favorite feature will be available soon!');
  };

  const renderItem = ({ item }: { item: ClosetItem }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { width: ITEM_WIDTH }]}
      onPress={() => router.push(`/item/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id, false)}
        >
          <Ionicons
            name='heart-outline'
            size={18}
            color='#F0FFFF'
          />
        </TouchableOpacity>
        {item.wearCount === 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.category}
        </Text>
        {item.colors.length > 0 && (
          <Text style={styles.itemColor}>{item.colors[0]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>My Closet</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#26538D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Closet</Text>

      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#26538D80" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your closet..."
            placeholderTextColor="#26538D80"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Pills */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesContent}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="shirt-outline" size={48} color="#26538D80" />
            </View>
            <Text style={styles.emptyTitle}>
              {items.length === 0 ? 'Your closet is empty' : 'No items found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {items.length === 0 
                ? 'Start building your digital wardrobe'
                : 'Try adjusting your search or filters'}
            </Text>
            {items.length === 0 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/upload')}
              >
                <Ionicons name="add" size={20} color="#F0FFFF" />
                <Text style={styles.addButtonText}>Add Your First Item</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Add Button */}
      {items.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/upload')}
        >
          <Ionicons name="add" size={28} color="#F0FFFF" />
        </TouchableOpacity>
      )}

      {/* Stats Summary */}
      {items.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{items.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {CATEGORIES.length - 1}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {items.filter(i => i.wearCount === 0).length}
            </Text>
            <Text style={styles.statLabel}>Unworn</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#26538D',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 83, 141, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(38, 83, 141, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#26538D',
  },
  categoriesContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(38, 83, 141, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(38, 83, 141, 0.15)',
  },
  categoryPillActive: {
    backgroundColor: '#26538D',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#26538D',
  },
  categoryTextActive: {
    color: '#F0FFFF',
  },
  listContent: {
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(38, 83, 141, 0.1)',
    shadowColor: '#26538D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: 'rgba(38, 83, 141, 0.03)',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(38, 83, 141, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#26538D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#F0FFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#26538D',
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 12,
    color: '#26538D80',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(38, 83, 141, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#26538D',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#26538D80',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26538D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#26538D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#F0FFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#26538D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#26538D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  statsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#26538D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240, 255, 255, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0FFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(240, 255, 255, 0.7)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(240, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
});