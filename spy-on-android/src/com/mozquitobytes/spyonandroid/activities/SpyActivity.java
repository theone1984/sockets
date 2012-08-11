package com.mozquitobytes.spyonandroid.activities;

import roboguice.activity.RoboActivity;
import roboguice.inject.InjectView;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;

import com.google.inject.Inject;
import com.mozquitobytes.spyonandroid.R;
import com.mozquitobytes.spyonandroid.interfaces.BitmapListener;
import com.mozquitobytes.spyonandroid.interfaces.CameraHandler;
import com.mozquitobytes.spyonandroid.interfaces.ErrorHandler;
import com.mozquitobytes.spyonandroid.utilities.DataUrlListener;
import com.mozquitobytes.spyonandroid.utilities.SocketClient;

public class SpyActivity extends RoboActivity {
    
    @Inject
    private SocketClient socketClient;
    
    @Inject
    private CameraHandler cameraHandler;

    @InjectView(R.id.imageViewCamera)
    private ImageView imageView;
    
    @InjectView(R.id.button)
    private Button button;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        setOnClickHandler();
        
        initializeCameraHandlers();
        initializeSocketHandlers();
        socketClient.connect("192.168.0.102", 9090);
    }
    
    private void setOnClickHandler() {
        button.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                cameraHandler.switchCamera();
            }
        });
    }

    private void initializeCameraHandlers() {
        cameraHandler.initialize();
        
        cameraHandler.setOnBitmapListener(new BitmapListener() {
            public void onBitmap(Bitmap bitmap) {
                imageView.setImageBitmap(bitmap);
            }
        });
        
        cameraHandler.setOnDataUrlListener(new DataUrlListener() {
            public void onDataUrl(String dataUrl) {
                if (socketClient.isConnected()) {
                    socketClient.write(dataUrl);
                }
            }
        });
    }
    
    private void initializeSocketHandlers() {
        socketClient.setOnErrorListener(new ErrorHandler() {
            public void onError(Throwable e) {
                Log.e("socket", e.getMessage());
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        cameraHandler.startPreviewCapture();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        cameraHandler.stopPreviewCapture();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        cameraHandler.dispose();
    }
}