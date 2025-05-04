import LocalAuthentication

@objc(BiometryTools)
class BiometryTools: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "BiometryTools"
  }
  
  var methodQueue: DispatchQueue {
    return DispatchQueue.main
  }
  
  @objc(getSupportedBiometryType::)
  func getSupportedBiometryType(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?
    
    let canBeProtected = context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error)
    
    if (error == nil && canBeProtected) {
      resolve(getBiometryType(context))
    } else {
      resolve(nil)
    }
  }
  
  @objc(isSensorAvailable::)
  func isSensorAvailable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      resolve(getBiometryType(context))
      
      return
    }
    
    let code = LAError.Code(rawValue: error!.code)
    let reason = getAvailabilityError(by: code)
    
    reject(reason.code, reason.message, nil)
  }
  
  @objc(authenticate::::)
  func authenticate(
    title: NSString,
    options: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let withDeviceCredentials: Bool = options["withDeviceCredentials"] as? Bool ?? false
      
      let context = LAContext()
      let policy: LAPolicy = withDeviceCredentials
        ? .deviceOwnerAuthentication
        : .deviceOwnerAuthenticationWithBiometrics
      
      context.evaluatePolicy(policy, localizedReason: String(title)) { success, error in
        if success {
          let result: NSDictionary = [
            "success": true
          ]
          return resolve(result)
        }
        
        
        if let error = error as? LAError {
          let reason = self.getAvailabilityError(by: error.code)
          
          return reject(reason.code, reason.message, nil)
        }
        
        reject("biometric_error", error?.localizedDescription ?? "unknown error", nil);
      }
    }
  }
  
  private func getBiometryType(_ context: LAContext) -> String {
    if #available(iOS 11, *) {
      return context.biometryType == .faceID ? "Face ID" : "Touch ID";
    }
    
    return "Touch ID";
  }
  
  private func getAvailabilityError(by code: LAError.Code?) -> SensorError {
    switch(code) {
    case .biometryNotAvailable:
      return BiometryNotAvailable()
    case .biometryNotEnrolled:
      return BiometryNotEnrolled()
    case .biometryLockout:
      return BiometryLockout()
    case .passcodeNotSet:
      return PasscodeNotSet()
    case .userCancel:
      return UserCanceled()
    default:
      return ScannerNotSupported()
    }
  }
}
