import { NativeModules } from 'react-native';

type BiometryToolsType = {
  multiply(a: number, b: number): Promise<number>;
};

const { BiometryTools } = NativeModules;

export default BiometryTools as BiometryToolsType;
