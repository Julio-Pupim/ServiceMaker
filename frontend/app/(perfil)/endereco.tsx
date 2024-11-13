import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, Pressable, FlatList, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';

export default function GerenciarEndereco() {
  const { control, handleSubmit, reset } = useForm();
  const [enderecos, setEnderecos] = useState<string[]>([]);

  const onSubmit = (data: { novoEndereco: string; }) => {
    if (data.novoEndereco.trim()) {
      setEnderecos(prevEnderecos => [...prevEnderecos, data.novoEndereco.trim()]);
      reset();
    }
  };

  const removerEndereco = (index: number) => {
    setEnderecos(prevEnderecos => prevEnderecos.filter((_, i) => i !== index));
  };

  const perfilClick =()=>{
    router.navigate('/(tabs)/perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={perfilClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="novoEndereco"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Adicionar novo endereço"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Pressable style={styles.addButton} onPress={handleSubmit(onSubmit)}>
          <Icon name="add" size={24} color="white" />
        </Pressable>
      </View>

      <FlatList
        data={enderecos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <Pressable onPress={() => removerEndereco(index)}>
              <Icon name="delete" size={24} color="red" />
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

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
    marginBottom: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FBCB1C',
    padding: 10,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  backIcon: {
    paddingRight: 15,
  },
});
