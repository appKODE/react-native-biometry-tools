protocol SensorError {
  var code: String { get }
  var message: String { get }
}

struct BiometryNotAvailable: SensorError {
  var code: String = "BiometryScannerNotAvailable"
  var message: String = "Biometry scanner is not available"
}

struct BiometryNotEnrolled: SensorError {
  var code: String = "BiometryScannerNotAvailable"
  var message: String = "Biometry scanner is not enrolled"
}

struct BiometryLockout: SensorError {
  var code: String = "DeviceLockedPermanent"
  var message: String = "Device locked permanent"
}

struct PasscodeNotSet: SensorError {
  var code: String = "PasscodeNotSet"
  var message: String = "Passcode not set"
}

struct ScannerNotSupported: SensorError {
  var code: String = "BiometryScannerNotSupported"
  var message: String = "Biometry scanner is not supported"
}

struct UserCanceled: SensorError {
  var code: String = "PromptCanceledByUser"
  var message: String = "User cancellation"
}
