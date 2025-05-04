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
  IRIS = 'Iris',
}

export enum BiometryErrorCode {
  NOT_ENROLLED = 'BiometryScannerNotEnrolled',
  NOT_SUPPORTED = 'BiometryScannerNotSupported',
  /**
   * ios only
   */
  NOT_AVAILABLE = 'BiometryScannerNotAvailable',
  /**
   * ios only
   */
  PASSCODE_NOT_SET = 'PasscodeNotSet',
  /**
   * ios only
   */
  DEVICE_LOCKED_PERMANENT = 'DeviceLockedPermanent',
  /**
   * User cancel authentication
   */
  AUTHENTICATION_CANCELED = 'AuthenticationCanceledByUser',
}

export type AuthenticationResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export type AuthenticateOptions = {
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
  getSupportedBiometryType: () => Promise<BiometryType | null>;
  /**
   * Authenticate user by biometry
   */
  authenticate: (
    title: string,
    options?: AuthenticateOptions,
  ) => Promise<AuthenticationResult>;
};

export interface BiometryAvailableError extends Error {
  code: BiometryErrorCode;
}

export interface AuthenticationError extends Error {
  code: BiometryErrorCode;
}

export const isAuthenticationCanceledError = (error: unknown) => {
  return error instanceof Error && 'code' in error && error.code === BiometryErrorCode.AUTHENTICATION_CANCELED
}

const { BiometryTools: Module } = NativeModules;

const BiometryTools: TBiometryTools = {
  isSensorAvailable: Module.isSensorAvailable,
  getSupportedBiometryType: Module.getSupportedBiometryType,
  authenticate: (
    title: string, 
    options: AuthenticateOptions = { withDeviceCredentials: false }
  ): Promise<AuthenticationResult> => {
    return Module.authenticate(title, options)
  }
}

export default BiometryTools;
