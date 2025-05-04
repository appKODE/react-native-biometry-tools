# react-native-biometry-tools

A lightweight library for determining the supported type of biometrics.

## 🚀 Motivation

The [react-native-keychain](https://www.npmjs.com/package/react-native-keychain) does not allow you to determine the type of biometrics supported by the device if it is not registered.

## 📥 Installation

```sh
yarn add @kode-frontend/react-native-biometry-tools
```

## 🎮 Usage

```js
import BiometryTools from '@kode-frontend/react-native-biometry-tools';

export default function App() {

  React.useEffect(() => {
    BiometryTools
      .isSensorAvailable()
      .then((biometryType) => {
          // sensor available
          // biometryType - supported biometry
      })
      .catch((e) => {
        // sensor not available
        // biometry not supported or not enrolled
        console.log(e.message)
        console.log(e.code)
      })

    BiometryTools
      .getSupportedBiometryType()
      .then((biometryType) => {
          // even if biometry not enrolled
          // biometryType - supported biometry, if biometry not supported then return null
      })
  }, []);

  return (
    <View />
  );
}

```

## 📦 Available methods

| method                                                    | description                                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| isSensorAvailable                                         | Promise return `BiometryType` if biometry is available and enrolled else throw error `BiometryError`    |
| getSupportedBiometryType                                  | Promise return `BiometryType` if biometry is supported else return `null` even if biometry not enrolled |
| authenticate(title: string, options: AuthenticateOptions) | Show prompt of biometry and return promise `AuthenticationResult`                                       |


## Types

```ts

enum BiometryType {
  // ios only
  FACE_ID = 'Face ID',
  TOUCH_ID = 'Touch ID',
  // android only
  FINGERPRINT = 'Fingerprint',
  FACE = 'Face',
  IRIS = 'Iris'
}


enum BiometryErrorCode {
  // common  
  NOT_SUPPORTED = 'BiometryScannerNotSupported',
  NOT_ENROLLED = 'BiometryScannerNotEnrolled',
  // ios only
  NOT_AVAILABLE = 'BiometryScannerNotAvailable',
  PASSCODE_NOT_SET = 'PasscodeNotSet',
  DEVICE_LOCKED_PERMANENT = 'DeviceLockedPermanent'

  // authentication
  AUTHENTICATION_CANCELED = 'AuthenticationCanceledByUser',
}

type AuthenticateOptions = {
  withDeviceCredentials?: boolean,
  /**
   * Cancel button text. Android only
   */
  cancelText?: string,
  /**
   * Subtitle for prompt. Android only
   */
  subtitle?: string,
  /**
   * Description for prompt. Android only
   */
  description?: string,
}

```

## Tags

`release` - create release tag and increase version
