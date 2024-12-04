import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { DateInput } from '@/components/DateInput';
import { TimeInput } from '@/components/HoraInput';
import PrestadorService from '../../service/prestadorservice';
import ServicoService from '../../service/ServicoService';
import ReservaService from '../../service/ReservaService';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/components/contextoApi';

type AgendamentoForm = {
  servico: any;
  prestador: any;
  data: Date | null;
  horaInicio: string;
  horaFim: string;
  status: any;
  usuario: any;
};

export default function Agendamento() {
  const { user } = useAuth();

  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  const { idPrestador, idServico, dataAgendamento } = useLocalSearchParams();

  const parsedDataAgendamento = dataAgendamento ? new Date(dataAgendamento.toString()) : null;
  const parsedIdServico = idServico ? parseInt(idServico.toString()) : null;
  const parsedIdPrestador = idPrestador ? parseInt(idPrestador.toString()) : null;

  const agendaClick = () => {
    router.navigate('/(tabs)/agenda');
  };
  
  // Definindo a função de validação personalizada para a data
  const validateDate = (value: Date | null) => {
    if (!value) {
      return 'Data é obrigatória';
    }
    
    // Exemplo de validação: A data não pode ser no passado
    if (new Date(value) < new Date()) {
      return 'A data não pode ser no passado';
    }

    return true; // Retorna true se a validação passar
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

  const fetchAgendamentos = async () => {
    try {
      const agendamentos = await ReservaService.getAllReservas();
      const agendamentosFiltrados = agendamentos.filter((agenda: { data: string }) => {
        const dataAgenda = new Date(agenda.data);
        return dataAgenda.toDateString() === new Date().toDateString(); // Filtra por data
      });
      setAgendamentos(agendamentosFiltrados); // Atualiza o estado com os agendamentos filtrados
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const deleteAgendamento = async (id: number) => {
    try {
      await ReservaService.deleteReserva(id);
      fetchAgendamentos();  // Recarrega a lista de agendamentos
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  const { control, handleSubmit, formState: { errors, isValid }, watch, setValue, getValues } = useForm<AgendamentoForm>({
    defaultValues: {
      prestador: '',
      servico: '',
      data: parsedDataAgendamento,
      horaInicio: '',
      horaFim: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const horaInicio = watch('horaInicio');
    const servicoSelecionado = watch('servico');

    if (horaInicio && servicoSelecionado) {
      handleHoraFimUpdate(horaInicio, servicoSelecionado);
    }
  }, [watch('horaInicio'), watch('servico')]);

  const calculateHoraFim = (horaInicio: string, tempoServico: string): string => {
    const hoje = new Date();
    const horaInicioDate = new Date(hoje.setHours(parseInt(horaInicio.split(':')[0]), parseInt(horaInicio.split(':')[1]), 0));
  
    const tempoServicoMinutos = parseInt(tempoServico, 10);
  
    horaInicioDate.setMinutes(horaInicioDate.getMinutes() + tempoServicoMinutos);
  
    const horaFim = horaInicioDate.toTimeString().substring(0, 5);
    return horaFim;
  };  

  const handleHoraFimUpdate = (horaInicio: string, servicoSelecionado: string) => {
    const servicoEncontrado = servicos.find(s => s.descricao === servicoSelecionado);
    const tempoServico = servicoEncontrado?.tempoServico ?? '';

    const newHoraFim = calculateHoraFim(horaInicio, tempoServico);
    console.log("Hora de fim calculada: ", newHoraFim);  // Verificar se o cálculo está correto
    setValue('horaFim', newHoraFim, { shouldDirty: true, shouldTouch: true });
  };

  const saveReserva = async (reserva: AgendamentoForm) => {
    reserva.usuario = { id: 2 };
    reserva.status = "PENDENTE"; // Definir status padrão

    console.log('Reserva a ser salva:', reserva); // Verifique se horaFim está sendo enviada corretamente

    try {
      await ReservaService.createReserva(reserva); // Envia os dados para a API
      router.navigate("/agenda"); // Redireciona após salvar
    } catch (error) {
      console.error('Erro ao cadastrar reserva:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={agendaClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon} color="white" />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>
      <Text style={styles.title}>Agendamento</Text>
      <View style={styles.agendaList}>
        {agendamentos.map((agenda) => (
          <View key={agenda.id} style={styles.agendaItem}>
            <Text>{`Prestador: ${agenda.prestador?.nome}`}</Text>
            <Text>{`Serviço: ${agenda.servico?.descricao}`}</Text>
            <Text>{`Data: ${new Date(agenda.data).toLocaleDateString()}`}</Text>
            <Text>{`Hora de Início: ${agenda.horaInicio}`}</Text>
            <Text>{`Hora de Fim: ${agenda.horaFim}`}</Text>
            <Pressable onPress={() => deleteAgendamento(agenda.id)}>
              <Text style={styles.deleteButton}>Excluir</Text>
            </Pressable>
          </View>
        ))}
      </View>

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
        render={({ field: { onChange, value } }) => (
          <View>
            <Text>Serviço</Text>
            <AutocompleteInput
              placeholder="Digite para buscar serviço"
              data={servicos || []}
              value={value}
              onChange={(value) => {
                onChange(value);
                handleHoraFimUpdate(watch('horaInicio'), value);
              }}
              onSelect={item => {
                onChange(item.descricao);
                handleHoraFimUpdate(watch('horaInicio'), value);
              }}
              filterKey="descricao"
            />
          </View>
        )}
      />
      {errors.servico && <Text style={styles.errorText}>{errors.servico.message?.toString()}</Text>}


      <Controller
      control={control}
      name="data"
      rules={{
        required: 'Data é um campo obrigatório',
      }}
      render={({ field: { onChange, value } }) => (
        <DateInput control={control} name="data" label="Data de Agendamento" value={value} onChange={onChange} />
      )}
    />
      {errors.data && <Text style={styles.errorText}>{errors.data.message}</Text>}

      <TimeInput
        placeholder="Escolha uma hora de início"
        value={watch('horaInicio')} // Garanta que o valor observado é usado
        onChange={(value) => {
          setValue('horaInicio', value, { shouldDirty: true, shouldTouch: true });
          handleHoraFimUpdate(value, watch('servico')); // Atualiza também horaFim
        }}
      />

      <TimeInput
        placeholder="Previsão de Conclusão"
        value={watch('horaFim')}  // Observando o valor de horaFim
        disabled={true}
      />

      <Controller
        control={control}
        name="status"
        rules={{ required: 'Status é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Text>Status</Text>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Pendente" value="PENDENTE" />
              <Picker.Item label="Confirmado" value="CONFIRMADO" />
              <Picker.Item label="Cancelado" value="CANCELADO" />
            </Picker>
          </View>
        )}
      />
      
      <Pressable
        style={[styles.button]}
        onPress={handleSubmit(saveReserva)}
      >
        <Text style={styles.buttonText}>Adicionar Agendamento</Text>
      </Pressable>
    </SafeAreaView>
  );
}

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
  dataTempo: {
    paddingRight: 25,
    paddingLeft: 3,
  },
  agendaList: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    borderRadius: 8,
  },
  agendaItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  deleteButton: {
    color: '#FF375B',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
  },
  picker: {
    height: 50,
    color: '#333',
    fontSize: 16,
    paddingLeft: 10,
  },
});
