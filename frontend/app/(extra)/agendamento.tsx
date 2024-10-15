import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import Icon from 'react-native-vector-icons/Ionicons';

const Agendamento = () => {
  const navigation = useNavigation();  

  const [servico, setServico] = useState('');
  const [prestador, setPrestador] = useState('');
  const [data, setData] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.label}>Serviço</Text>
      <TextInput style={styles.input} value={servico} onChangeText={setServico} placeholder="Tipo de Serviço" />

      <Text style={styles.label}>Prestador</Text>
      <TextInput style={styles.input} value={prestador} onChangeText={setPrestador} placeholder="Nome do Prestador" />

      <Text style={styles.label}>Data</Text>
      <Text style={styles.input}>{data.toDateString()}</Text>

      <Text style={styles.label}>Hora de Início</Text>
      <Text style={styles.input}>{horaInicio.toLocaleTimeString()}</Text>

      <Text style={styles.label}>Hora Final</Text>
      <Text style={styles.input}>{horaFim.toLocaleTimeString()}</Text>

      <Text style={styles.label}>Localização</Text>
      <TextInput style={styles.input} placeholder="Endereço" />

      <Text style={styles.label}>Anotação</Text>
      <TextInput style={styles.input} placeholder="Anotação..." multiline={true} numberOfLines={3} />

      <Button title="Agendar" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  returnButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FBCB1C',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
});

export default Agendamento;
