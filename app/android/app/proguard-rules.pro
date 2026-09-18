-keep class **.zego.**  { *; }
-keep class **.**.zego_zpns.** { *; }
-keepclassmembers class ai.deepar.ar.DeepAR { *; }
-keepclassmembers class ai.deepar.ar.core.videotexture.VideoTextureAndroidJava { *; }
-keep class ai.deepar.ar.core.videotexture.VideoTextureAndroidJava
  -keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepattributes JavascriptInterface
-keepattributes *Annotation*

-dontwarn com.razorpay.**
-keep class com.razorpay.** {*;}

-optimizations !method/inlining/*

-keepclasseswithmembers class * {
  public void onPayment*(...);
}

# Suppress R8 missing class warnings for optional libraries
-dontwarn com.arthenica.**
-dontwarn com.stripe.**
-dontwarn com.reactnativestripesdk.**