import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Outfit } from '../../types';

const OCCASIONS = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'office', label: 'Office' },
  { id: 'party', label: 'Party' },
  { id: 'date', label: 'Date' },
  { id: 'casual', label: 'Casual' },
];

export default function OutfitsScreen() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState('all');

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    try {
      // Check for demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      const user = auth.currentUser;
      if (!user && !isDemoMode) {
        router.replace('/(auth)/login');
        return;
      }
      
      // For demo mode, show empty state
      if (isDemoMode && !user) {
        setOutfits([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'outfits'),
        where('userId', '==', user!.uid)
      );

      const snapshot = await getDocs(q);
      const outfitsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Outfit[];

      setOutfits(outfitsData);
    } catch (error) {
      console.error('Error loading outfits:', error);
      Alert.alert('Error', 'Failed to load outfits');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOutfit = () => {
    Alert.alert('Coming Soon', 'AI outfit generation will be available soon!');
  };

  const filteredOutfits = outfits.filter((outfit) => {
    if (selectedOccasion === 'all') return true;
    return outfit.occasion?.toLowerCase() === selectedOccasion.toLowerCase();
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#26538D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Outfits</Text>

      {/* Occasion Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersContent}>
          {OCCASIONS.map((occasion) => (
            <TouchableOpacity
              key={occasion.id}
              style={[
                styles.filterPill,
                selectedOccasion === occasion.id && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOccasion(occasion.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedOccasion === occasion.id && styles.filterTextActive,
                ]}
              >
                {occasion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredOutfits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="sparkles" size={50} color="#26538D" />
            </View>
            <Text style={styles.emptyTitle}>No outfits yet</Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateOutfit}
            >
              <Ionicons name="color-wand" size={20} color="#F0FFFF" />
              <Text style={styles.generateButtonText}>Generate Your First Outfit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.outfitsGrid}
          >
            {/* Outfits will be displayed here when available */}
            {filteredOutfits.map((outfit) => (
              <View key={outfit.id} style={styles.outfitCard}>
                <Text style={styles.outfitName}>{outfit.name || 'Untitled Outfit'}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#26538D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filtersContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(38, 83, 141, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(38, 83, 141, 0.15)',
  },
  filterPillActive: {
    backgroundColor: '#26538D',
    borderColor: '#26538D',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#26538D',
  },
  filterTextActive: {
    color: '#F0FFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(38, 83, 141, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#26538D',
    marginBottom: 24,
  },
  generateButton: {
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
  generateButtonText: {
    color: '#F0FFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  outfitsGrid: {
    paddingBottom: 20,
  },
  outfitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 83, 141, 0.1)',
    shadowColor: '#26538D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#26538D',
  },
});
