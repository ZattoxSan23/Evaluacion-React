import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text, StyleSheet, Button } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginScreen from './app/screens/LoginScreen';
import AdminDashboard from './app/screens/AdminDashboard';
import TrainerDashboard from './app/screens/TrainerDashboard';
import ClientDashboard from './app/screens/ClientDashboard';

const Stack = createNativeStackNavigator();
type Role = 'admin' | 'trainer' | 'client';
type RoleResult = { userId: string; role: Role | null; error: string | null };
const isRole = (value: unknown): value is Role =>
  value === 'admin' || value === 'trainer' || value === 'client';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [roleResult, setRoleResult] = useState<RoleResult | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    let active = true;
    let authEventSeen = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      authEventSeen = true;
      // Keep the auth callback synchronous: profile queries run in a separate effect.
      setSession(nextSession);
      setSessionError(null);
      setLoading(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      // A newer auth event must win over the startup snapshot.
      if (!active || authEventSeen) return;
      setSession(data.session);
      setSessionError(error ? 'No se pudo recuperar la sesión.' : null);
      setLoading(false);
    }).catch(() => {
      if (!active || authEventSeen) return;
      setSessionError('No se pudo recuperar la sesión.');
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    setRoleResult(null);
    if (!userId) return () => { active = false; };

    void (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        if (!active) return;
        const role = data?.role;
        setRoleResult({
          userId,
          role: !error && isRole(role) ? role : null,
          error: error || !isRole(role)
            ? 'No se pudo verificar tu perfil. Contacta al administrador.'
            : null,
        });
      } catch {
        if (active) setRoleResult({ userId, role: null, error: 'No se pudo verificar tu perfil.' });
      }
    })();

    // Discard a previous user's delayed response after sign-out or account changes.
    return () => { active = false; };
  }, [userId]);

  if (loading || (userId && roleResult?.userId !== userId)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>{loading ? 'Inicializando...' : 'Verificando permisos...'}</Text>
      </View>
    );
  }

  const error = sessionError || (userId ? roleResult?.error : null);
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text accessibilityRole="alert" style={styles.loadingText}>{error}</Text>
        <Button title="Volver al inicio de sesión" onPress={() => {
          void supabase.auth.signOut().then(({ error: signOutError }) => {
            if (!signOutError) {
              setSession(null);
              setSessionError(null);
              setRoleResult(null);
            }
          }).catch(() => setSessionError('No se pudo cerrar la sesión. Intenta nuevamente.'));
        }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : roleResult?.role === 'admin' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : roleResult?.role === 'trainer' ? (
          <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
        ) : roleResult?.role === 'client' ? (
          <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#000000', padding: 20, gap: 16,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#FFD700', fontWeight: 'bold' },
});
