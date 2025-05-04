import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import BiometryTools, { BiometryType, isAuthenticationCanceledError } from '@kode-frontend/react-native-biometry-tools';

export default function App() {
  const [isAvailable, setAvailableSensor] = React.useState<boolean>(false);
  const [supportedBiometryType, setBiometryType] =
    React.useState<BiometryType | null>(null);
  const [error, setBiometryErrorMessage] = React.useState<string | undefined>();

  React.useEffect(() => {
    BiometryTools.isSensorAvailable()
      .then(() => setAvailableSensor(true))
      .catch((e) => {
        setBiometryErrorMessage(e.message);
        setAvailableSensor(false);
      });

    BiometryTools.getSupportedBiometryType().then(setBiometryType);
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Sensor is available:{' '}
        <Text style={styles.resultText}>{JSON.stringify(isAvailable)}</Text>
      </Text>
      {!!error && (
        <Text>
          Reason unavailable: <Text style={styles.resultText}>{error}</Text>
        </Text>
      )}
      <Text>
        Supported biometry type:{' '}
        <Text style={styles.resultText}>{supportedBiometryType}</Text>
      </Text>

      <Button
        title="Prompt authentication"
        onPress={() => {
          BiometryTools.authenticate('Title', { 
            subtitle: 'subtitle',
            description: 'description', 
            withDeviceCredentials: true, 
            cancelText: 'Cancel' 
          })
            .then((result) => {
              console.log('Prompt result:', result);
            })
            .catch((e) => {
              if (isAuthenticationCanceledError(e)) {
                return console.log('Cancelled by user')
              }
              console.log('Prompt error:', e.message);
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  resultText: {
    fontWeight: '700',
  },
});
