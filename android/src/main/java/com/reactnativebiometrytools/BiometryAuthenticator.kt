package com.reactnativebiometrytools

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricPrompt.PromptInfo
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.UiThreadUtil
import java.util.concurrent.Executor
import java.util.concurrent.Executors

class BiometryAuthenticator(
  private val fragmentActivity: FragmentActivity,
  private val title: String,
  private val subtitle: String?,
  private val description: String?,
  private val cancelText: String,
  private val withDeviceCredentials: Boolean,
  private val callback: Callback
) {
  val executor: Executor =
    Executors.newSingleThreadExecutor()

  fun authenticate() {
    UiThreadUtil.runOnUiThread {
      try {
        val authCallback = object : BiometricPrompt.AuthenticationCallback() {
          override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            super.onAuthenticationSucceeded(result)
            callback.onSuccess()
          }

          override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
            super.onAuthenticationError(errorCode, errString)
            when (errorCode) {
              BiometricPrompt.ERROR_NEGATIVE_BUTTON -> callback.onCanceled()
              BiometricPrompt.ERROR_USER_CANCELED -> callback.onCanceled()
              else ->  callback.onError(errorCode, errString.toString())
            }
          }
        }

        val biometricPrompt = BiometricPrompt(
          fragmentActivity,
          executor,
          authCallback
        )

        val builder = PromptInfo.Builder()
          .setTitle(title)
          .setAllowedAuthenticators(getAllowedAuthenticators(withDeviceCredentials))

        if (!withDeviceCredentials) {
          builder.setNegativeButtonText(cancelText)
        }

        if (!subtitle.isNullOrEmpty()) {
          builder.setSubtitle(subtitle)
        }

        if (!description.isNullOrEmpty()) {
          builder.setDescription(description)
        }


        biometricPrompt.authenticate(builder.build())
      } catch (e: Throwable) {
        callback.onError(e)
      }
    }
  }

  private fun getAllowedAuthenticators(withDeviceCredentials: Boolean): Int {
    if (withDeviceCredentials) {
      return BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL
    }
    return BiometricManager.Authenticators.BIOMETRIC_STRONG
  }

  interface Callback {
    fun onError(code: Int, message: String)
    fun onError(e: Throwable)
    fun onSuccess()
    fun onCanceled()
  }
}
