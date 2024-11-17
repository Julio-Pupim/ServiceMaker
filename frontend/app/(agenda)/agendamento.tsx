import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, StatusBar, Alert, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Controller, Form, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { DateInput } from '@/components/DateInput';
import { TimeInput } from '@/components/HoraInput';
import ReservaService from '../../service/ReservaService'
import PrestadorService from '../../service/prestadorservice'
import ServicoService from '../../service/ServicoService'
import { AutocompleteInput } from '@/components/AutocompleteInput';

type AgendamentoForm = {
  servico: any;
  prestador: any;
  anotacao: string;
  data: Date | null;
  hora: Date | null;
  horaFim: Date;
};

const prestadorClick = () => {
  router.navigate('/(servico)/prestador')
}



export default function Agendamento() {

  const [prestadores, setPrestadores] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [filteredServicos, setFilteredServicos] = useState([]);


  const { idPrestador, idServico, dataAgendamento } = useLocalSearchParams();

  const parsedDataAgendamento = dataAgendamento ? new Date(dataAgendamento.toString()) : null;
  const parsedIdServico = idServico ? parseInt(idServico.toString()) : null
  const parsedIdPrestador = idPrestador ? parseInt(idPrestador.toString()) : null

  const agendaClick = () => {
    router.navigate('/(tabs)/agenda');
  };

  const fetchPrestadores = async () => {
    try {
      const response = await PrestadorService.getAllPrestadores();
      setPrestadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await ServicoService.getServicosByPrestador();
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  useEffect(() => {
    fetchPrestadores();
    fetchServicos();
  }, []);

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<AgendamentoForm>({
    defaultValues: {
      servico: '',
      prestador: '',
      anotacao: '',
      data: parsedDataAgendamento,
      hora: null,
    },
    mode: 'onChange',
  });

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
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <Text style={styles.title}>Agendamento</Text>
      <Controller
        control={control}
        name="prestador"
        rules={{ required: 'Prestador é um campo obrigatório' }}
        defaultValue={async ()=>{
          if(parsedIdPrestador){
            const response =await PrestadorService.getPrestadorById()
            return response.data
          }
          return ''
        }}
        render={({ field: { onChange, value } }) => (
          <AutocompleteInput
            placeholder="Digite para buscar prestador"
            data={prestadores}
            value={value}
            onChange={onChange}
            onSelect={(item) => {
              onChange(item.id);
              setFilteredServicos(servicos.filter((s) => s.prestadorId === item.id));
            }}
            filterKey="nome"
          />
        )}
      />
      {errors.prestador && <Text style={styles.errorText}>{errors.prestador.message}</Text>}

      <Controller
        control={control}
        name="servico"
        rules={{ required: 'Serviço é um campo obrigatório' }}
        defaultValue={async ()=>{
          if(parsedIdServico){
            const response = await ServicoService.getServicoById()
            return response.data;
          }
          return ''
        }}
        render={({ field: { onChange, value } }) => (
          <AutocompleteInput
            placeholder="Digite para buscar serviço"
            data={filteredServicos}
            value={value}
            onChange={onChange}
            onSelect={(item) => onChange(item.id)}
            filterKey="nome"
          />
        )}
      />
      {errors.servico && <Text style={styles.errorText}>{errors.servico.message}</Text>}


      <DateInput
        control={control}
        name="data"
        label="Data de Agendamento"
      />

      {errors.data && <Text style={styles.errorText}>{errors.data.message}</Text>}

      <TimeInput
        control={control}
        name="hora"
        label="Escolha um horário para atendimento"
      />
      {errors.hora && <Text style={styles.errorText}>{errors.hora.message}</Text>}

      <Controller
        control={control}
        name="anotacao"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Anotação"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Pressable
        style={[styles.button]}
        onPress={handleSubmit(saveReserva)}
        disabled={!isValid || watch('data') !== null}
      >
        <Text style={styles.buttonText} onPress={() => router.push('/(tabs)/agenda')}>Adicionar Agendamento</Text>
      </Pressable>

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    height: 50,
    backgroundColor: '#FBCB1C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007BFF',
  },
  errorText: {
    color: '#FF375B',
    marginLeft: 10,
  },
  backIcon: {
    paddingRight: 15,
  },
});
