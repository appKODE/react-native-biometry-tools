#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BiometryTools, NSObject)

RCT_EXTERN_METHOD(getSupportedBiometryType
                  :(RCTPromiseResolveBlock)resolve
                  :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isSensorAvailable
                  :(RCTPromiseResolveBlock)resolve
                  :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authenticate
                  :(NSString *)message
                  :(NSDictionary *)options
                  :(RCTPromiseResolveBlock)resolve
                  :(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
