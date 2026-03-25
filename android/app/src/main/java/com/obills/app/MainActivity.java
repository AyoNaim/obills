package com.obills.app;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this); // Add this line
        super.onCreate(savedInstanceState);
    }
}
