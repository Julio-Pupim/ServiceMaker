import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Pressable, Alert, TextInput, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Avaliacao() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Por favor, escolha uma nota antes de enviar.');
    } else {
      Alert.alert(`Obrigado pela sua avaliação de ${rating} estrelas!`);
      console.log('Feedback:', feedback);
      //Linking.openURL('https://play.google.com/store/apps/details?id=your.package');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>
      <Text style={styles.description}>Nos Avalie</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Icon
              name={star <= rating ? "star" : "star-border"}
              size={40}
              color="#FFD700"
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Descreva sua experiência e sugestões"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
      />
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enviar Avaliação</Text>
      </Pressable>

      <Pressable style={styles.returnButton} onPress={() => router.push('/(tabs)/perfil')}>
        <Text style={styles.returnText}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
    width: '100%',
  },
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  feedbackInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FBCB1C',
    padding: 15,
    borderRadius: 5,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  returnButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  returnText: {
    color: '#007BFF',
  },
});
