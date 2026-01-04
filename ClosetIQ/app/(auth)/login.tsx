import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../../services/firebase';

const { width, height } = Dimensions.get('window');

const AnimatedBlob = ({ delay = 0, size = 200, top, left, right, bottom }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 7000,
          delay: delay,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0, 30, -20, 0],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0, -50, 20, 0],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [1, 1.1, 0.9, 1],
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          top,
          left,
          right,
          bottom,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
};

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showToast = (title: string, description: string) => {
    Alert.alert(title, description);
  };

  const handleSubmit = async () => {
    // Validation
    if (!email.includes("@")) {
      showToast("Validation Error", "Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      showToast("Validation Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Demo credentials - bypass Firebase for demo
    if (email === "demo@closetiq.com" && password === "demo123") {
      // Set a demo flag in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('demoMode', 'true');
      }
      showToast("Demo Mode", "Logged in with demo credentials!");
      setIsLoading(false);
      router.push('/(tabs)/closet');
      return;
    }

    // Real Firebase authentication
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Success!", "You've been logged in successfully.");
      router.replace('/(tabs)/closet');
    } catch (error: any) {
      showToast(
        "Login Failed",
        error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    showToast(
      "Demo Mode",
      "Google sign-in is not implemented. Use these test credentials instead:\n\nEmail: demo@closetiq.com\nPassword: demo123"
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={['#26538D', '#3a6ba8', '#5d8cc4']}
        style={styles.gradient}
      />

      {/* Animated Blobs */}
      <AnimatedBlob size={300} top={-50} left={-50} delay={0} />
      <AnimatedBlob size={250} top={-50} right={-50} delay={2000} />
      <AnimatedBlob size={300} bottom={-100} left={50} delay={4000} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Container */}
        <View style={styles.cardContainer}>
          <BlurView intensity={20} tint="light" style={styles.blurCard}>
            {/* Logo and Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#26538D', '#3a6ba8']}
                style={styles.logoContainer}
              >
                <Ionicons name="sparkles" size={32} color="#F0FFFF" />
              </LinearGradient>
              
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to ClosetIQ
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#F0FFFF99" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#F0FFFF80"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#F0FFFF99" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="#F0FFFF80"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#F0FFFF99"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => showToast("Coming Soon", "Password reset will be available soon!")}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#26538D', '#1a3d6b']}
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#F0FFFF" size="small" />
                      <Text style={styles.submitButtonText}>Signing in...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <BlurView intensity={30} tint="light" style={styles.googleButton}>
                <Ionicons name="logo-google" size={20} color="#F0FFFF" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </BlurView>
            </TouchableOpacity>

            {/* Toggle Sign Up */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                Don't have an account?{" "}
                <Text style={styles.toggleTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {" "}and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    backgroundColor: '#F0FFFF',
    opacity: 0.2,
    borderRadius: 9999,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  blurCard: {
    backgroundColor: 'rgba(240, 255, 255, 0.15)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(240, 255, 255, 0.3)',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0FFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(240, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(240, 255, 255, 0.95)',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(240, 255, 255, 0.25)',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F0FFFF',
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: 'rgba(240, 255, 255, 0.75)',
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#F0FFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(240, 255, 255, 0.25)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(240, 255, 255, 0.6)',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240, 255, 255, 0.25)',
    backgroundColor: 'rgba(240, 255, 255, 0.1)',
    gap: 12,
  },
  googleButtonText: {
    color: '#F0FFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: 'rgba(240, 255, 255, 0.8)',
  },
  toggleTextBold: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: 12,
    color: 'rgba(240, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 24,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
