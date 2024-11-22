import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/components/contextoApi';

const DetalhesServico = () => {
  const [descricao, setDescricao] = useState('');
  const descricaoMaxLength = 240;
  const { nomeUsuario } = useUser();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.serviceTitle}>Conserto de Ar-Condicionado</Text>
        <Text style={styles.companyName}>(CoolTech)</Text>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="black" />
          <Text style={styles.detailText}>Data: 03/05/2024</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="black" />
          <Text style={styles.detailText}>Prestador: Rafael</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="black" />
          <Text style={styles.detailText}>Local: Avenida Guedes Marques Oliveira 211-Zona 03</Text>
        </View>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Descreva como foi o serviço..."
          multiline
          maxLength={descricaoMaxLength}
          value={descricao}
          onChangeText={setDescricao}
        />
        <Text style={styles.charCount}>{descricao.length}/{descricaoMaxLength}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Avaliação: ★★★★☆</Text>
          <Text style={styles.footerText}>Custo: R$250,00</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
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
  content: {
    padding: 20,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  companyName: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 80,
  },
  charCount: {
    textAlign: 'right',
    color: 'gray',
    fontSize: 14,
    marginTop: 5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetalhesServico;
