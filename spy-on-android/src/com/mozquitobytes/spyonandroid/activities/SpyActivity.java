package com.mozquitobytes.spyonandroid.activities;

import java.net.URL;

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
import com.mozquitobytes.spyonandroid.interfaces.DataFromServerListener;
import com.mozquitobytes.spyonandroid.interfaces.DataUrlListener;
import com.mozquitobytes.spyonandroid.interfaces.ErrorListener;
import com.mozquitobytes.spyonandroid.utilities.CameraHandler;
import com.mozquitobytes.spyonandroid.utilities.MulticastReceiver;
import com.mozquitobytes.spyonandroid.utilities.SocketClient;

public class SpyActivity extends RoboActivity {
	private static final String SWITCH_MESSAGE_COMMAND = "switch-camera";

	@Inject
	private MulticastReceiver multicastReceiver;
	
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
		startConnectingToServer();

	}

	private void setOnClickHandler() {
		button.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				cameraHandler.switchCamera();
			}
		});
	}
	
	private void startConnectingToServer() {
		listenForMulticast();
	}

	private void listenForMulticast() {
		multicastReceiver.connect("225.2.2.114", 8283);
		multicastReceiver.setOnDataFromServerListener(new DataFromServerListener() {
			public void onMessage(String message) {
				try {
					URL url = new URL(message);
					connectToServer(url);
					multicastReceiver.disconnect();
				} catch (Exception e) {
					System.out.println("bla");
				}
			}
		});
	}

	private void connectToServer(URL serverUrl) {
		String ipAddress = serverUrl.getHost();
		int port = serverUrl.getPort();
		
		socketClient.connect(ipAddress, port);
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
		socketClient.setOnErrorListener(new ErrorListener() {
			public void onError(Throwable e) {
				Log.e("socket", e.getMessage());
			}
		});

		socketClient.setOnDataFromServerListener(new DataFromServerListener() {
			public void onMessage(String message) {
				if (SWITCH_MESSAGE_COMMAND.equals(message)) {
					cameraHandler.switchCamera();
				}
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
		socketClient.dispose();
		multicastReceiver.disconnect();
	}
}