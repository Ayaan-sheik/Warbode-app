import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: name,
        email: email,
        createdAt: new Date(),
      });

      router.replace('/(tabs)/closet');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="items-center mt-8 mb-8">
          <View className="bg-purple-600 rounded-full p-6 mb-4">
            <Ionicons name="person-add" size={48} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            Create Account
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Join ClosetIQ and transform your wardrobe
          </Text>
        </View>

        {/* Signup Form */}
        <View className="mt-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Full Name
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text className="text-sm font-medium text-gray-700 mb-2">
            Email
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text className="text-sm font-medium text-gray-700 mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-6">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className="bg-purple-600 rounded-lg py-4 items-center mb-4"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-purple-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
