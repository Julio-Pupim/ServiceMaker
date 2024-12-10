import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { DateInput } from '@/components/DateInput';
import { TimeInput } from '@/components/HoraInput';
import PrestadorService from '../../service/PrestadorService'
import ServicoService from '../../service/ServicoService'
import ReservaService from '../../service/ReservaService'
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { useAuth } from '@/components/contextoApi';
import { Picker } from '@react-native-picker/picker';

type AgendamentoForm = {
  servico: any;
  prestador: any;
  dataReserva: Date | null;
  horarioInicio: string;
  horarioFim: string;
  status: any,
  cliente: any
  agenda: any
};

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

  const { user } = useAuth();

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
        setValue('prestador', prestador || '');
        setServicos(prestador?.servicos || []);
      }
      if (parsedIdServico) {
        const servico = await ServicoService.getServicoById(parsedIdServico);
        setValue('servico', servico || '');
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

  const { control, handleSubmit,  formState: { errors, isValid }, watch, setValue, getFieldState, getValues } = useForm<AgendamentoForm>({
    defaultValues: {
      prestador: '',
      servico: '',
      dataReserva: parsedDataAgendamento,
      horarioInicio: '',
      horarioFim: '',
    },
    mode: 'onChange',
  });

  const handleHoraFimUpdate = (horaInicio: any, servicoSelecionado: any) => {
    const servicoEncontrado = servicos.find(s => s.descricao === servicoSelecionado?.descricao);
    const tempoServico = servicoEncontrado?.tempoServico ?? '';

    const newHoraFim = calculateHoraFim(horaInicio, tempoServico);
    console.log("Calculando horaFim: ", newHoraFim);

    setValue('horarioFim', newHoraFim, { shouldDirty: true, shouldTouch: true });
  };

  const saveReserva = async (reserva: AgendamentoForm) => {
    reserva.cliente = user ;
    reserva.agenda = reserva.prestador?.agenda
    reserva.status = "PENDENTE";
    console.log(reserva);

    try {
      await ReservaService.createReserva(reserva);
      router.navigate("/agenda");
      
    } catch (error) {
      console.error('Erro ao cadastrar reserva:', error);

    }

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
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>
      <Text style={styles.title}>Agendamento</Text>
      <View style={styles.fields}>        
        <Controller
          control={control}
          name="prestador"
          rules={{ required: 'Prestador é um campo obrigatório' }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Prestador</Text>
              <AutocompleteInput
                placeholder="Digite para buscar prestador"
                data={prestadores || []}
                value={value}
                onChange={onChange}
                onSelect={(item) => {
                  onChange(item);
                  setServicos(item.servicos || []);
                }}
                filterKey="nome"
              />
            </View>
          )}
        />
        {errors.prestador && <Text style={styles.errorText}>{errors.prestador.message?.toString()}</Text>}
        

        <Controller
          control={control}
          name="servico"
          rules={{ required: 'Serviço é um campo obrigatório' }}
          render={({ field: { onChange, value }, formState }) => (
            <View>
              <Text>Serviço</Text>
              <AutocompleteInput
                placeholder="Digite para buscar serviço"
                data={servicos || []}
                value={value}
                onChange={(value) => {
                  onChange(value);
                  handleHoraFimUpdate(watch('horarioInicio'), value);
                }}
                onSelect={item => {
                  onChange(item);
                  handleHoraFimUpdate(watch('horarioInicio'), value);
                }}
                filterKey="descricao"
              />
            </View>
          )}
        />
        {errors.servico && <Text style={styles.errorText}>{errors.servico.message?.toString()}</Text>}

        <View style={styles.dataTempo}>
          <DateInput
            control={control}
            name="dataReserva"
            label="Data de Agendamento"
          />
          {errors.dataReserva && <Text style={styles.errorText}>{errors.dataReserva.message}</Text>}

          <TimeInput
            placeholder="Escolha uma hora de início"
            value={watch('horarioInicio')} // Garanta que o valor observado é usado
            onChange={(value) => {
              setValue('horarioInicio', value, { shouldDirty: true, shouldTouch: true });
              console.log("Dentro do OnChange do HoraInicio: ", watch('servico'))
              handleHoraFimUpdate(value, watch('servico')); // Atualiza também horaFim
            }}
          />

          {errors.horarioInicio && <Text style={styles.errorText}>{errors.horarioInicio.message}</Text>}
          <TimeInput
            placeholder="Previsão de Conclusão"
            value={watch('horarioFim')} // Use o valor diretamente do estado
            disabled={true}
          />
          
          <Pressable
            style={[styles.button]}
            onPress={handleSubmit(saveReserva)}
            disabled={!isValid || watch('dataReserva') == null}
          >
            <Text style={styles.buttonText}>Adicionar Agendamento</Text>
          </Pressable>
        </View>
      </View>
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
    justifyContent: 'center',
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
  dataTempo: {
    paddingRight: 25,
    paddingLeft: 3
  },
  fields: {
    marginLeft: 30,
    marginRight: 30
  }
});