import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ClosetItem } from '../../types';

export default function AdminScreen() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'closetItems'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const loadedItems = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as ClosetItem[];

      setItems(loadedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 px-4 py-4 flex-row items-center border-b border-gray-700">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">
          Admin Panel 🎯
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Info Banner */}
        <View className="bg-purple-900 px-4 py-4 m-4 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Ionicons name="eye" size={24} color="#A78BFA" />
            <Text className="text-purple-200 font-bold ml-2 text-lg">
              Judge View
            </Text>
          </View>
          <Text className="text-purple-300 text-sm">
            This panel shows internal AI processing data, confidence scores, and
            rule engine outputs. Perfect for demonstrating the intelligence
            behind the app.
          </Text>
        </View>

        {/* System Stats */}
        <View className="px-4 mb-4">
          <Text className="text-gray-400 font-semibold mb-3">
            SYSTEM STATISTICS
          </Text>
          <View className="bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between mb-3 pb-3 border-b border-gray-700">
              <Text className="text-gray-400">Total Items Analyzed</Text>
              <Text className="text-white font-bold">{items.length}</Text>
            </View>
            <View className="flex-row justify-between mb-3 pb-3 border-b border-gray-700">
              <Text className="text-gray-400">Avg Confidence Score</Text>
              <Text className="text-green-400 font-bold">
                {items.length > 0
                  ? (
                      items.reduce((sum, item) => sum + item.confidence, 0) /
                      items.length
                    ).toFixed(2)
                  : '0.00'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-400">AI Engine</Text>
              <Text className="text-purple-400 font-bold">
                Vision API + GPT-4o
              </Text>
            </View>
          </View>
        </View>

        {/* Item Analysis */}
        <View className="px-4 mb-6">
          <Text className="text-gray-400 font-semibold mb-3">
            AI ANALYSIS DATA
          </Text>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                setExpandedItem(expandedItem === item.id ? null : item.id)
              }
              className="bg-gray-800 rounded-lg p-4 mb-3"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold capitalize">
                  {item.category}
                </Text>
                <View className="bg-purple-900 px-3 py-1 rounded-full">
                  <Text
                    className={`font-bold ${getConfidenceColor(
                      item.confidence
                    )}`}
                  >
                    {(item.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>

              {expandedItem === item.id && (
                <View className="mt-3 pt-3 border-t border-gray-700">
                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs mb-1">
                      DETECTED COLORS
                    </Text>
                    <View className="flex-row flex-wrap">
                      {item.colors.map((color, idx) => (
                        <View
                          key={idx}
                          className="bg-gray-700 px-2 py-1 rounded mr-2 mb-1"
                        >
                          <Text className="text-gray-300 text-sm">
                            {color}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs mb-1">PATTERN</Text>
                    <Text className="text-white capitalize">{item.pattern}</Text>
                  </View>

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs mb-1">
                      SEASON CLASSIFICATION
                    </Text>
                    <View className="flex-row flex-wrap">
                      {item.season.map((s, idx) => (
                        <View
                          key={idx}
                          className="bg-blue-900 px-2 py-1 rounded mr-2"
                        >
                          <Text className="text-blue-300 text-sm capitalize">
                            {s}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {item.fabric && (
                    <View className="mb-3">
                      <Text className="text-gray-500 text-xs mb-1">
                        FABRIC TYPE
                      </Text>
                      <Text className="text-white capitalize">
                        {item.fabric}
                      </Text>
                    </View>
                  )}

                  <View className="mb-3">
                    <Text className="text-gray-500 text-xs mb-1">
                      AI LABELS
                    </Text>
                    <View className="flex-row flex-wrap">
                      {item.tags?.map((tag, idx) => (
                        <View
                          key={idx}
                          className="bg-gray-700 px-2 py-1 rounded mr-2 mb-1"
                        >
                          <Text className="text-gray-400 text-xs">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View>
                    <Text className="text-gray-500 text-xs mb-1">
                      USAGE METRICS
                    </Text>
                    <Text className="text-gray-300">
                      Worn {item.wearCount} times
                    </Text>
                    {item.price && (
                      <Text className="text-gray-300">
                        Cost per wear: $
                        {item.wearCount > 0
                          ? (item.price / item.wearCount).toFixed(2)
                          : item.price.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-gray-500 text-xs">
                  Tap to {expandedItem === item.id ? 'collapse' : 'expand'}
                </Text>
                <Ionicons
                  name={
                    expandedItem === item.id ? 'chevron-up' : 'chevron-down'
                  }
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rule Engine Info */}
        <View className="px-4 mb-6">
          <Text className="text-gray-400 font-semibold mb-3">
            OUTFIT MATCHING RULES
          </Text>
          <View className="bg-gray-800 rounded-lg p-4">
            <Text className="text-purple-400 font-bold mb-2">
              Confidence Formula
            </Text>
            <Text className="text-gray-300 text-sm font-mono mb-4">
              confidence = colorScore × 0.4 + trendScore × 0.3 + occasionScore
              × 0.3
            </Text>

            <Text className="text-purple-400 font-bold mb-2">
              Color Compatibility
            </Text>
            <Text className="text-gray-300 text-sm mb-4">
              Uses predefined color harmony matrix with 200+ combinations
            </Text>

            <Text className="text-purple-400 font-bold mb-2">
              Trend Alignment
            </Text>
            <Text className="text-gray-300 text-sm">
              Cross-references items with {'{trends.json}'} database for
              current fashion trends
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
