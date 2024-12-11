import { useAuth } from '@/components/contextoApi';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, ScrollView, Pressable, StatusBar } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import { Setor } from '@/constants/SetorEnum';
import ServicoService from '../../service/ServicoService';

type editaServicoProps = {
  nome: string;
  tempo: string;
  nomePrestador: string;
  descricaoServico: string;
  preco: string;
  setor: Setor;
}

const perfilClick = () => {
  router.navigate('/(perfil)/listaservicos');
};

export default function EdicaoServico() {
  const { user } = useAuth();
  const { idServico } = useLocalSearchParams(); // Pega o parâmetro 'id' da URL
  const [servico, setServico] = useState<editaServicoProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServico = async () => {
        try {
          const response = await ServicoService.getServicoById(idServico);
          setServico({
            nome: response.servico,
            tempo: response.tempoServico,
            nomePrestador: response.prestador.nome,
            descricaoServico: response.descricao,
            preco: response.preco.toFixed(2).replace('.', ','),
            setor: response.setor,
          });
        } catch (error) {
          console.error('Erro ao buscar o serviço:', error);
        } finally {
          setLoading(false);
        }
      
    };
    
    fetchServico();
  }, []);

  const handleTempoChange = (text: string) => setServico(prev => prev ? { ...prev, tempo: text } : prev);
  const handlePrecoChange = (text: string) => setServico(prev => prev ? { ...prev, preco: text } : prev);
  const handleSetorChange = (value: Setor) => setServico(prev => prev ? { ...prev, setor: value } : prev);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!servico) {
    return <Text>Serviço não encontrado.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={perfilClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon} color="white" />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Edição do Serviço</Text>
        <View style={styles.formulario}>

          <View>
            <Text style={styles.label}>Título do Serviço</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={servico.nome}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Tempo</Text>
            <View style={styles.wrapperInput}>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'HH:mm',
                }}
                value={servico.tempo}
                onChangeText={handleTempoChange}
                style={styles.input}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Preço</Text>
            <View style={styles.wrapperInput}>
              <TextInputMask
                type={'money'}
                options={{
                  unit: 'R$ ',
                  separator: ',',
                  precision: 2,
                }}
                value={servico.preco}
                onChangeText={handlePrecoChange}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Setor</Text>
            <View style={styles.wrapperInput}>
              <Picker
                selectedValue={servico.setor}
                style={styles.input}
                onValueChange={handleSetorChange}
              >
                <Picker.Item label="Escolha um setor" value={undefined} />
                <Picker.Item label="Setor 1" value={Setor.SETOR1} />
                <Picker.Item label="Setor 2" value={Setor.SETOR2} />
                <Picker.Item label="Setor 3" value={Setor.SETOR3} />
              </Picker>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Descrição</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={servico.descricaoServico}
                multiline
                style={[styles.input, styles.inputDescricao]}
                editable={true}
              />
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  formulario: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    padding: 0,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputDescricao: {
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff', 
  },
  backIcon: {
    paddingRight: 15,
  },
});
