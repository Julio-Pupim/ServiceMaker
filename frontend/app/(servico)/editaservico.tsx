import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, ScrollView, Pressable, StatusBar } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { obterNomeUsuario } from '@/utils/storageUtils';

const [nomeUsuario, setNomeUsuario] = useState('Usuário');

type editaServicoProps = {
  nome: string;
  data: string;
  nomePrestador: string;
  local: string;
  descricaoServico: string;
  custo: string;
}

const agendaClick = ()=>{
  router.navigate('/(tabs)/agenda')
}

export default function editaServico({
  nome,
  data: initialData,
  custo: initialCusto,
  nomePrestador,
  local,
  descricaoServico,
}: editaServicoProps) {
  const [data, setData] = useState<string>(initialData); 
  const [custo, setCusto] = useState<string>(initialCusto);

  const handleChange = (text: string) => {
    setData(text);
  };

  const handleCustoChange = (text: string) => {
    setCusto(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={agendaClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formulario}>
          
          <View>
            <Text style={styles.label}>Serviço</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={nome}
                style={styles.input}
                editable={true}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Data</Text>
            <View style={styles.wrapperInput}>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={data}
                onChangeText={handleChange}
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Prestador</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={nomePrestador}
                style={styles.input}
                editable={true}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Local</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={local}
                style={styles.input}
                editable={true} 
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Custo</Text>
            <View style={styles.wrapperInput}>
              <TextInputMask
                type={'money'}
                options={{
                  unit: 'R$ ',
                  separator: ',',
                  precision: 2,
                }}
                value={custo}
                onChangeText={handleCustoChange}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.separator} />

          <View>
            <Text style={styles.label}>Descrição</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={descricaoServico}
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
  iconEditar: {
    marginLeft: 10,
    position: 'absolute',
    right: 10,
  },
  separator: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  avaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  custo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  custoInput: {
    width: 80,
    height: 40,
    textAlign: 'right',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  backIcon: {
    paddingRight: 15,
  },
});
