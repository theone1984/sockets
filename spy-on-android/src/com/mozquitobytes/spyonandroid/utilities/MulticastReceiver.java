package com.mozquitobytes.spyonandroid.utilities;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;

import roboguice.inject.ContextScoped;
import android.content.Context;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiManager.MulticastLock;
import android.util.Log;
import android.widget.Toast;

import com.google.inject.Inject;

@ContextScoped
public class MulticastReceiver {
    @Inject
    private Context context;
    
    private InetAddress address;
    private int port;
    
    private MulticastSocket socket;    
    private MulticastLock multicastLock;
    
    private boolean connected = false;
    
    public void connect(String ipAddress, int port) {
        try {
            doConnect(ipAddress, port);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private void doConnect(String ipAddress, int port) throws Exception {
        if (connected) {
            throw new IllegalStateException("The socket is already connected");
        }
        
        this.address = InetAddress.getByName(ipAddress);
        this.port = port;
        
        allowMulticast();
        connectSocketToGroup();
        
        connected = true;
        startListenToSocket();
    }

    private void allowMulticast() {
        WifiManager wm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        MulticastLock multicastLock = wm.createMulticastLock("mydebuginfo");
        multicastLock.acquire();
    }
    
    private void connectSocketToGroup() throws Exception {
        socket = new MulticastSocket(port);
        socket.setTimeToLive(100);
        socket.joinGroup(address);
    }
    
    private void startListenToSocket() {
        Thread waitForMessageThread = new Thread() {
            public void run() {
                while (connected) {
                    waitForMessage();
                }
            }
        };
        
        waitForMessageThread.start();
    }
    
    protected void waitForMessage() {
        try {
            doWaitForMessage();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
    
    private void doWaitForMessage() throws IOException {
        byte[] buffer = new byte[65535];
        DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, port);
        
        socket.receive(packet);
        String message = new String(packet.getData(), 0, packet.getLength());

        Log.d("message", message);
    }

    public void disconnect() {
        if (!connected) {
            throw new IllegalStateException("The socket is not yet connected");
        }
        
        connected = false;
        
        socket.close();
        multicastLock.release();
        
        socket = null;
        multicastLock = null;
    }
}