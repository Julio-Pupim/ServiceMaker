import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DateInput = ({ control, name, label }: any) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                onChange={(e) => onChange(e.target.value)}
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
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text>{value || 'Selecione uma data'}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowPicker(false);
                      if (selectedDate) {
                        onChange(selectedDate.toISOString());
                      }
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      />
    </View>
  );
};
