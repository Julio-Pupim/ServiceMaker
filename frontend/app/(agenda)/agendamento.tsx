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
  horaInicio: string;
  horaFim: string;
};

const prestadorClick = () => {
  router.navigate('/(servico)/prestador')
}

const calculateHoraFim = (horaInicio: string, tempoServico: string) => {

  if (!horaInicio || !tempoServico) {
    return '';
  }
  const [hours, minutes] = horaInicio.split(':').map(Number);
  const [serviceHours, serviceMinutes] = tempoServico.split(':').map(Number);

  const totalMinutes = hours * 60 + minutes + serviceHours * 60 + serviceMinutes;

  const finalHours = Math.floor(totalMinutes / 60) % 24;
  const finalMinutes = totalMinutes % 60;

  return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
};


export default function Agendamento() {

  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

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

  const fetchDataFromUrl = async () => {
    try {
      if (parsedIdPrestador) {
        const prestador = await PrestadorService.getPrestadorById(parsedIdPrestador);
        setValue('prestador', prestador?.nome || '');
        setServicos(prestador?.servicos || []);
      }
      if (parsedIdServico) {
        const servico = await ServicoService.getServicoById(parsedIdServico);
        setValue('servico', servico?.descricao || '');
      }
    } catch (error) {
      console.error('Erro ao buscar dados da URL:', error);
    }
  };

  useEffect(() => {
    if (parsedIdPrestador || parsedIdServico) {
      fetchDataFromUrl();
    } else {
      fetchPrestadores();
    }
  }, []);

  const { control, handleSubmit, formState: { errors, isValid }, watch, setValue, getValues } = useForm<AgendamentoForm>({
    defaultValues: {
      prestador: '',
      servico: '',
      anotacao: '',
      data: parsedDataAgendamento,
      horaInicio: '',
      horaFim: '',
    },
    mode: 'onChange',
  });


  const handleHoraFimUpdate = (horaInicio, servicoSelecionado) => {
    const servicoEncontrado = servicos.find(s => s.descricao === servicoSelecionado);
    const tempoServico = servicoEncontrado?.tempoServico ?? '';

    const newHoraFim = calculateHoraFim(horaInicio, tempoServico);
    console.log("DADOS SERVICO: ", servicoEncontrado)
    console.log("Dadods Hora: ", horaInicio)
    setValue('horaFim', newHoraFim, { shouldDirty: true });
  };



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
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>
      <Text style={styles.title}>Agendamento</Text>
      <Controller
        control={control}
        name="prestador"
        rules={{ required: 'Prestador é um campo obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <AutocompleteInput
            placeholder="Digite para buscar prestador"
            data={prestadores || []}
            value={value}
            onChange={onChange}
            onSelect={(item) => {
              onChange(item.nome);
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
        render={({ field: { onChange, value }, formState }) => (
          <AutocompleteInput
            placeholder="Digite para buscar serviço"
            data={servicos || []}
            value={value}
            onChange={(value) => {
              console.log('onChange:', value); 
              onChange(value)
              handleHoraFimUpdate(watch('horaInicio'), value);
              console.log(formState.dirtyFields)
            }}
            onSelect={item => {
              console.log('onSelect:', item.descricao); 
              onChange(item.descricao);
              handleHoraFimUpdate(watch('horaInicio'), value);
            }}
            filterKey="descricao"
          />
        )}
      />
      {errors.servico && <Text style={styles.errorText}>{errors.servico.message?.toString()}</Text>}


      <DateInput
        control={control}
        name="data"
        label="Data de Agendamento"
      />

      {errors.data && <Text style={styles.errorText}>{errors.data.message}</Text>}

      <Controller
        control={control}
        name="horaInicio"
        disabled={true}
        render={({ field: { onChange, value } }) => (
          <TimeInput
            placeholder="Escolha uma hora de início "
            value={value}
            onChange={value => {
              onChange(value);
              setValue('horaInicio', value, { shouldDirty: true });
              handleHoraFimUpdate(value, getValues('servico'));
            }}
          />
        )}
      />

      {errors.horaInicio && <Text style={styles.errorText}>{errors.horaInicio.message}</Text>}
      <Controller
        control={control}
        name="horaFim"
        disabled={true}
        render={({ field: { onChange, value } }) => (
          <TimeInput
            placeholder="Previsão de Conclusão"
            value={value}
            onChange={onChange}
            disabled={true}
          />
        )}
      />

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
  readonlyText: { fontSize: 16, color: '#555' },
});
