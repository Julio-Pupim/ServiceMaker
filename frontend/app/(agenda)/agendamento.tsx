import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { DateInput } from '@/components/DateInput';
import { TimeInput } from '@/components/HoraInput';
import PrestadorService from '../../service/prestadorservice'
import ServicoService from '../../service/ServicoService'
import ReservaService from '../../service/ReservaService'
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

  const [prestadores, setPrestadores] = useState<any>([]);
  const [servicos, setServicos] = useState<any>([]);

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
      setPrestadores(response);
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    }
  };

  const fetchPrestadorUrl = async (idPrestador: any) => {
    try {
      const response = await PrestadorService.getPrestadorById(idPrestador);
      setPrestadores(response);
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    }
  };

  const fetchServicoUrl = async (idServico: any) => {
    try {
      const response = await ServicoService.getServicoById(idServico);
      setServicos(response);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  useEffect(() => {
    if (!parsedIdPrestador && !parsedIdServico) {
      fetchPrestadores();
      
    }
  }, []);

  const { control, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<AgendamentoForm>({
    defaultValues: {
      anotacao: '',
      data: parsedDataAgendamento,
      hora: null,
    },
    mode: 'onChange',
  });

  const saveReserva = (reserva: AgendamentoForm) => {
    console.log(reserva)
  }

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

      <Text style={styles.title}>Agendamento</Text>
      <Controller
        control={control}
        name="prestador"
        rules={{ required: 'Prestador é um campo obrigatório' }}
        defaultValue={async () => {
          if (parsedIdPrestador) {
            PrestadorService.getPrestadorById(parsedIdPrestador).then((response) => {
              setValue("prestador", response.nome); // Atualiza o valor do campo
              setPrestadores(prestadores);
            });
          }
          return ''
        }}
        render={({ field: { onChange, value, } }) => (
          <AutocompleteInput
            placeholder="Digite para buscar prestador"
            data={prestadores}
            value={value}
            onChange={onChange}
            onSelect={(item) => {
              console.log("AAAA",item)
              onChange(item.nome);
             value={item}
             setServicos(item.servicos || []);
            }}
            filterKey="nome"
          />
        )}
      />
      {errors.prestador && <Text style={styles.errorText}>{errors.prestador.message?.toString()}</Text>}

      <Controller
        control={control}
        name="servico"
        rules={{ required: 'Serviço é um campo obrigatório' }}
        defaultValue={async () => {
          if (parsedIdServico) {
            return await ServicoService.getServicoById().then((response)=>{
              setValue('servico',response.descricao)
              setServicos(response)
            })  
          }
          return ''
        }}
        render={({ field: { onChange, value } }) => (
          <AutocompleteInput
            placeholder="Digite para buscar serviço"
            data={servicos}
            value={value}
            onChange={onChange}
            onSelect={(item) => {
              value={item} 
              onChange(item.descricao)}
            }
            filterKey="descricao"
          />
        )}
      />
      {errors.servico && <Text style={styles.errorText}>{errors.servico.message?.toString()}</Text>}

      <View style={styles.dataTempo}>  
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

      </View>

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
    marginTop: 25,
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  dataTempo:{
    paddingRight:25,
    paddingLeft:3
  }
});
