import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { analyzeClothingImage } from '../../services/vision';
import { ClothingCategory, Pattern, Season } from '../../types';

export default function UploadScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to add items'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(result.assets.map(asset => asset.uri));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera permissions to take photos'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets) {
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Images', 'Please select at least one image');
      return;
    }

    setUploading(true);
    setAnalyzing(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      for (const imageUri of selectedImages) {
        // Analyze image with AI
        const analysis = await analyzeClothingImage(imageUri);

        // Upload image to Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const filename = `closet/${user.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        // Save item to Firestore
        await addDoc(collection(db, 'closetItems'), {
          userId: user.uid,
          imageUrl: downloadURL,
          category: analysis.category,
          colors: analysis.colors,
          pattern: analysis.pattern,
          fabric: analysis.fabric,
          season: analysis.season,
          confidence: analysis.confidence,
          wearCount: 0,
          tags: analysis.labels,
          createdAt: new Date(),
        });
      }

      Alert.alert(
        'Success!',
        `Added ${selectedImages.length} item(s) to your closet`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error uploading:', error);
      Alert.alert('Error', 'Failed to upload items');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-purple-600 px-4 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">
          Add to Closet
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Upload Options */}
        {selectedImages.length === 0 ? (
          <View className="px-6 py-12">
            <TouchableOpacity
              onPress={takePicture}
              className="bg-purple-600 rounded-lg p-6 items-center mb-4"
            >
              <Ionicons name="camera" size={48} color="white" />
              <Text className="text-white text-lg font-semibold mt-3">
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImages}
              className="bg-purple-100 rounded-lg p-6 items-center"
            >
              <Ionicons name="images" size={48} color="#8B5CF6" />
              <Text className="text-purple-600 text-lg font-semibold mt-3">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <View className="mt-8 bg-blue-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
                <Text className="text-blue-800 font-semibold ml-2">
                  Tips for best results
                </Text>
              </View>
              <Text className="text-blue-700 text-sm">
                • Use good lighting{'\n'}
                • Place item on plain background{'\n'}
                • Take full-item photos{'\n'}
                • You can add multiple items at once
              </Text>
            </View>
          </View>
        ) : (
          <View className="px-4 py-4">
            {/* Selected Images Grid */}
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Selected Items ({selectedImages.length})
            </Text>
            <View className="flex-row flex-wrap">
              {selectedImages.map((uri, index) => (
                <View key={index} className="w-[48%] mr-2 mb-2">
                  <Image
                    source={{ uri }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedImages(
                        selectedImages.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add More Button */}
            <TouchableOpacity
              onPress={pickImages}
              className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-center mt-3"
            >
              <Ionicons name="add" size={24} color="#4B5563" />
              <Text className="text-gray-700 font-medium ml-2">
                Add More Items
              </Text>
            </TouchableOpacity>

            {/* AI Info */}
            <View className="mt-6 bg-purple-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                <Text className="text-purple-800 font-semibold ml-2">
                  AI Analysis Enabled
                </Text>
              </View>
              <Text className="text-purple-700 text-sm">
                Our AI will automatically detect color, category, pattern, and
                season for each item
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Upload Button */}
      {selectedImages.length > 0 && (
        <View className="px-4 py-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={uploadImages}
            disabled={uploading}
            className="bg-purple-600 rounded-lg p-4 items-center"
          >
            {uploading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  {analyzing ? 'Analyzing with AI...' : 'Uploading...'}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">
                Add {selectedImages.length} Item(s) to Closet
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
