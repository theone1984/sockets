package com.mozquitobytes.spyonandroid.activities;

import roboguice.activity.RoboActivity;

import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.google.inject.Inject;
import com.mozquitobytes.spyonandroid.R;
import com.mozquitobytes.spyonandroid.interfaces.DataFromServerListener;
import com.mozquitobytes.spyonandroid.utilities.MulticastReceiver;

public class MulticastActivity extends RoboActivity {

	@Inject
	private MulticastReceiver multicastReceiver;
	
    @Inject
	private Handler handler;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		
		multicastReceiver.connect("225.2.2.114", 8283);
		multicastReceiver.setOnDataFromServerListener(new DataFromServerListener() {
			public void onMessage(final String message) {
				handler.post(new Runnable() {
					public void run() {
						Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
					}
				});
			}
		});
	}
	
	@Override
	protected void onDestroy() {
		super.onDestroy();
		multicastReceiver.disconnect();
	}
}