import React, { useState } from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


type TimeInputProps = {
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (text: string) => void;
};

export const TimeInput: React.FC<TimeInputProps> = ({
  placeholder,
  value,
  disabled = false,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text>{placeholder}</Text>
      <>
        {Platform.OS === 'web' ? (
          // Campo para Web
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{
              borderWidth: 1,
              padding: 10,
              borderColor: '#ccc',
              borderRadius: 5,
              marginTop: 5,
              width: '100%',
            }}
          />
        ) : (
          <>
            <Pressable
              style={{
                borderWidth: 1,
                padding: 10,
                borderColor: '#ccc',
                borderRadius: 5,
                marginTop: 5,
              }}
              onPress={() => {
                if (!disabled) {
                  setShowPicker(true)
                }
              }}
            >
              <Text>{value || 'Selecione um horário'}</Text>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                disabled={disabled}
                value={
                  value
                    ? new Date(`1970-01-01T${value}:00`)
                    : new Date()
                }
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowPicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours()
                      .toString()
                      .padStart(2, '0');
                    const minutes = selectedTime.getMinutes()
                      .toString()
                      .padStart(2, '0');
                    onChange(`${hours}:${minutes}`);
                  }
                }}
              />
            )}
          </>
        )}
      </>
    </View>
  );
};
