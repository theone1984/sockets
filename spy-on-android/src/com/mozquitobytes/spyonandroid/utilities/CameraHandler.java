package com.mozquitobytes.spyonandroid.utilities;

import java.io.ByteArrayOutputStream;

import roboguice.inject.ContextScoped;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.hardware.Camera.Parameters;
import android.hardware.Camera.PreviewCallback;
import android.os.Handler;
import android.util.Base64;

import com.google.inject.Inject;
import com.mozquitobytes.spyonandroid.interfaces.BitmapListener;
import com.mozquitobytes.spyonandroid.interfaces.DataUrlListener;

@ContextScoped
public class CameraHandler {
    private Camera camera;
    private Integer cameraId = null; 
    
    private boolean disposed = true;

    private int width;
    private int height;
    private int imageFormat;

    private byte[] currentData;

    private BitmapListener bitmapListener;
    
    private DataUrlListener dataUrlListener;
    
    @Inject
    private Handler handler;
    
    public void initialize() {
        initialize(null);
    }
    
    private void initialize(Integer id) {
        openCamera(id == null ? cameraId : id);
        startDecodeThread();
        initializeCameraParameters();
    }
    
    private void openCamera(Integer id) {
        camera = (id == null) ? Camera.open() : Camera.open(id);
        cameraId = (id == null) ? 0 : id;        
    }
    
    private void startDecodeThread() {
        disposed = false;
        Thread cameraDecodeThread = new Thread() {
            public void run() {
                while (!disposed) {
                    processCurrentData();
                }
            }
        };
        cameraDecodeThread.start();
    }

    private void processCurrentData() {
        byte[] data = currentData;

        if (data == null) {
            return;
        }

        byte[] jpegBytes = getJpegBytes(data);

        if (bitmapListener != null) {
            processAsBitmap(jpegBytes);
        }
        if (dataUrlListener != null) {
            processAsDataUrl(jpegBytes);
        }
    }
    
    private byte[] getJpegBytes(byte[] data) {
        Rect rect = new Rect(0, 0, width, height);
        YuvImage img = new YuvImage(data, ImageFormat.NV21, width, height, null);
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        img.compressToJpeg(rect, 100, outStream);
        return outStream.toByteArray();
    }
    
    private void processAsDataUrl(byte[] jpegBytes) {
        String encodedImageString = Base64.encodeToString(jpegBytes, Base64.DEFAULT);
        String dataUrlString = "data:image/jpg;base64," + encodedImageString;
        
        sendDataUrl(dataUrlString);
    }
    
    private void sendDataUrl(String dataUrlString) {
        if (dataUrlListener != null) {
            dataUrlListener.onDataUrl(dataUrlString);
        }
    }

    private void processAsBitmap(byte[] jpegBytes) {
        Bitmap bitmap = BitmapFactory.decodeByteArray(jpegBytes, 0, jpegBytes.length);
        sendBitmap(bitmap); 
    }
    
    private void sendBitmap(final Bitmap bitmap) {
        handler.post(new Runnable() {
            public void run() {
                if (bitmapListener != null) {
                    bitmapListener.onBitmap(bitmap);
                }
            }
        });
    }

    private void initializeCameraParameters() {
        Parameters parameters = camera.getParameters();
        width = parameters.getPreviewSize().width;
        height = parameters.getPreviewSize().height;
        imageFormat = parameters.getPreviewFormat();
    }

    public void startPreviewCapture() {
        initializeListeners();
        camera.startPreview();
    }

    private void initializeListeners() {
        if (imageFormat != ImageFormat.NV21) {
            return;
        }

        camera.setPreviewCallback(new PreviewCallback() {
            public void onPreviewFrame(byte[] data, Camera camera) {
                handlePreview(data);
            }
        });
    }

    private void handlePreview(byte[] data) {
        currentData = data;
    }

    public void stopPreviewCapture() {
        camera.setPreviewCallback(null);
        currentData = null;
        camera.stopPreview();
    }

    public void dispose() {
        camera.release();
        stopDecodeThread();
        camera = null;
    }

    private void stopDecodeThread() {
        disposed = true;
    }
    
    public void switchCamera() {
       int newCameraId = (cameraId + 1) % Camera.getNumberOfCameras();
       
       stopPreviewCapture();
       dispose();
       initialize(newCameraId);
       startPreviewCapture();
    }

    public void setOnBitmapListener(BitmapListener bitmapListener) {
        this.bitmapListener = bitmapListener;
    }
    
    public void setOnDataUrlListener(DataUrlListener dataUrlListener) {
        this.dataUrlListener = dataUrlListener;
    }
}