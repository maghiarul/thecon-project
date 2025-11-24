import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Toast } from '@/components/toast';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !fullName)) {
      showToast('Completează toate câmpurile', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        showToast('Cont creat cu succes!', 'success');
        setTimeout(() => router.replace('/(tabs)'), 1500);
      } else {
        await signIn(email, password);
        showToast('Autentificare reușită!', 'success');
        setTimeout(() => router.replace('/(tabs)'), 1500);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Autentificare eșuată', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
              <Ionicons name="restaurant" size={48} color="#fff" />
            </View>
            <ThemedText type="title" style={styles.title}>
              {isSignUp ? 'Creează Cont' : 'Bun venit'}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {isSignUp ? 'Descoperă cele mai bune locații' : 'Continuă experiența'}
            </ThemedText>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, { backgroundColor: `${borderColor}08`, borderColor: `${borderColor}15` }]}>
                  <Ionicons name="person-outline" size={20} color={tintColor} />
                  <TextInput
                    style={[styles.input, { color: borderColor }]}
                    placeholder="Nume complet"
                    placeholderTextColor={`${borderColor}40`}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, { backgroundColor: `${borderColor}08`, borderColor: `${borderColor}15` }]}>
                <Ionicons name="mail-outline" size={20} color={tintColor} />
                <TextInput
                  style={[styles.input, { color: borderColor }]}
                  placeholder="Email"
                  placeholderTextColor={`${borderColor}40`}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, { backgroundColor: `${borderColor}08`, borderColor: `${borderColor}15` }]}>
                <Ionicons name="lock-closed-outline" size={20} color={tintColor} />
                <TextInput
                  style={[styles.input, { color: borderColor }]}
                  placeholder="Parolă"
                  placeholderTextColor={`${borderColor}40`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: tintColor, opacity: loading ? 0.7 : 1 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <ThemedText style={styles.buttonText}>
                    {isSignUp ? 'Creează Cont' : 'Autentificare'}
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </View>
              )}
            </Pressable>

            <Pressable onPress={() => setIsSignUp(!isSignUp)} disabled={loading}>
              <ThemedText style={[styles.switchText, { color: tintColor }]}>
                {isSignUp ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Înregistrează-te'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
});
