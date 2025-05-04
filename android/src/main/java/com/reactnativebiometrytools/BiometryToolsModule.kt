package com.reactnativebiometrytools

import android.content.pm.PackageManager
import androidx.biometric.BiometricManager
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BiometryToolsModule.NAME)
class BiometryToolsModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return NAME
  }


  @ReactMethod
  fun getSupportedBiometryType(promise: Promise) {
    promise.resolve(availableFeature)
  }

  @ReactMethod
  fun isSensorAvailable(promise: Promise) {
    val biometrySupportedType = availableFeature

    if (biometrySupportedType == NONE) {
      return promise.reject(NOT_SUPPORTED, "Biometry scanner is not supported")
    }

    val biometricManager = BiometricManager.from(reactApplicationContext)

    when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
      BiometricManager.BIOMETRIC_SUCCESS -> promise.resolve(biometrySupportedType)
      else -> promise.reject(
        NOT_ENROLLED,
        "Biometry scanner is not enrolled"
      )
    }
  }

  @ReactMethod
  fun authenticate(
    title: String,
    options: ReadableMap,
    promise: Promise
  ) {
    if (availableFeature == NONE) {
      return promise.reject(NOT_SUPPORTED, "Biometry scanner is not supported")
    }

    BiometryAuthenticator(
      fragmentActivity = currentActivity as FragmentActivity,
      title = title,
      subtitle = options.getString("subtitle"),
      description = options.getString("description"),
      withDeviceCredentials = options.getBoolean("withDeviceCredentials"),
      cancelText = options.getString("cancelText") ?: "Cancel",
      callback = object : BiometryAuthenticator.Callback {
        override fun onError(code: Int, message: String) {
          promise.reject(code.toString(), message)
        }

        override fun onError(e: Throwable) {
          promise.reject(e)
        }

        override fun onSuccess() {
          val successResult = WritableNativeMap()

          successResult.putBoolean("success", true)

          promise.resolve(successResult)
        }

        override fun onCanceled() {
          promise.reject(AUTHENTICATION_CANCELED, "User cancellation")
        }
      }
    ).authenticate()
  }

  private val availableFeature: String?
    get() {
      if (
        reactApplicationContext.packageManager
          .hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)
      ) {
        return FINGERPRINT
      }

      if (
        reactApplicationContext.packageManager
          .hasSystemFeature(PackageManager.FEATURE_FACE)
      ) {
        return FACE
      }

      if (
        reactApplicationContext.packageManager
          .hasSystemFeature(PackageManager.FEATURE_IRIS)
      ) {
        return IRIS
      }

      return NONE
    }

  companion object {
    private val NONE: String? = null
    private const val FINGERPRINT = "Fingerprint"
    private const val FACE = "Face"
    private const val IRIS = "Iris"

    const val NAME: String = "BiometryTools"

    private const val AUTHENTICATION_CANCELED = "AuthenticationCanceledByUser"
    private const val NOT_ENROLLED = "BiometryScannerNotEnrolled"
    private const val NOT_SUPPORTED = "BiometryScannerNotSupported"
  }
}
