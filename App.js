import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AppNavigation from './src/navigation/index'
import { apiCall } from './src/api/openAI';

export default function App() {
  useEffect(() => {
    apiCall("what is quantum computing");
  }, [])

  return (
    <AppNavigation />
  );
}