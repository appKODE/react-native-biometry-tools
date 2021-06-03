import { NativeModules } from 'react-native';

export enum BiometryType {
  /**
   * ios only
   */ 
  FACE_ID = 'Face ID',
  /**
   * ios only
   */ 
  TOUCH_ID = 'Touch ID',
  /**
   * android only
   */ 
  FINGERPRINT = 'Fingerprint',
  /**
   * android only
   */ 
  FACE = 'Face',
  /**
   * android only
   */ 
  IRIS = 'Iris'
}

export enum BiometryError {
  NOT_AVAILABLE = 'BiometryScannerNotAvailable',
  NOT_SUPPORTED = 'BiometryScannerNotSupported',
  /**
   * ios only
   */ 
  NOT_ENROLLED = 'BiometryScannerNotEnrolled',
  /**
   * ios only
   */ 
  PASSCODE_NOT_SET = 'PasscodeNotSet',
  /**
   * ios only
   */ 
  DEVICE_LOCKED_PERMANENT = 'DeviceLockedPermanent'
}

type TBiometryTools = {
  /**
   * Promise return supported biometry type if biometry is available/supported
   * else it throws an exception
   */
  isSensorAvailable: () => Promise<BiometryType>;
   /**
   * Promise return supported biometry type if biometry is supported
   * else it returns null
   */
  getSupportedBiometryType: () => Promise<BiometryType | null>
};

const { BiometryTools } = NativeModules;

export default BiometryTools as TBiometryTools;
