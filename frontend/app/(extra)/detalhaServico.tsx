import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';

type DetalharServicoProps = {
  nome: string;
  data: string;
  nomePrestador: string;
  local: string;
  descricaoServico: string;
  custo: string;
}

export default function DetalharServico({
  nome,
  data,
  nomePrestador,
  local,
  descricaoServico,
  custo
}: DetalharServicoProps) {
  const [rating, setRating] = useState(0);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={20}
          color="#FFD700"
          onPress={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
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
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Data</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={data}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Prestador</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={nomePrestador}
                style={styles.input}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Local</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={local}
                style={styles.input}
                editable={false} 
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
                editable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.avaliacao}>
              <Text style={styles.label}>Avaliação</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>

            <View style={styles.custo}>
              <Text style={styles.label}>Custo</Text>
              <TextInput
                value={custo}
                style={styles.custoInput}
                editable={false}
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
});
