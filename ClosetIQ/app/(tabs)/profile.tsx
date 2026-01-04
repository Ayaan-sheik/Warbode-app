import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOutfits: 0,
    avgCostPerWear: 0,
    sustainabilityScore: 85,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  };

  const user = auth.currentUser;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-purple-600 px-6 py-8">
        <View className="items-center">
          <View className="bg-white rounded-full w-24 h-24 items-center justify-center mb-4">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Ionicons name="person" size={48} color="#8B5CF6" />
            )}
          </View>
          <Text className="text-white text-2xl font-bold">
            {user?.displayName || 'User'}
          </Text>
          <Text className="text-purple-200 mt-1">{user?.email}</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="px-4 py-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Your Stats
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <View className="bg-white rounded-lg p-4 w-[48%] mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="shirt-outline" size={24} color="#8B5CF6" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.totalItems}
            </Text>
            <Text className="text-sm text-gray-600">Closet Items</Text>
          </View>

          <View className="bg-white rounded-lg p-4 w-[48%] mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="color-palette-outline" size={24} color="#EC4899" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.totalOutfits}
            </Text>
            <Text className="text-sm text-gray-600">Saved Outfits</Text>
          </View>

          <View className="bg-white rounded-lg p-4 w-[48%] mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="leaf-outline" size={24} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {stats.sustainabilityScore}%
            </Text>
            <Text className="text-sm text-gray-600">Sustainability</Text>
          </View>

          <View className="bg-white rounded-lg p-4 w-[48%] mb-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Ionicons name="cash-outline" size={24} color="#F59E0B" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              ${stats.avgCostPerWear}
            </Text>
            <Text className="text-sm text-gray-600">Avg Cost/Wear</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View className="px-4 py-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Preferences
        </Text>

        <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center">
            <Ionicons name="brush-outline" size={24} color="#8B5CF6" />
            <Text className="text-gray-800 ml-3 text-base">
              Fashion Style
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={24} color="#8B5CF6" />
            <Text className="text-gray-800 ml-3 text-base">Location</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={24} color="#8B5CF6" />
            <Text className="text-gray-800 ml-3 text-base">
              Notifications
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Admin/Debug (Hidden Feature) */}
      <View className="px-4 py-4">
        <TouchableOpacity
          onPress={() => router.push('/admin')}
          className="bg-gray-800 rounded-lg p-4 flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <Ionicons name="code-slash" size={24} color="#FFFFFF" />
            <Text className="text-white ml-3 text-base font-medium">
              Admin Panel (Judge View)
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <View className="px-4 py-4 mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white ml-2 text-base font-semibold">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
