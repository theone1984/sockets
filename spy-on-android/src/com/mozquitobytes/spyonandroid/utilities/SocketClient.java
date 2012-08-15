package com.mozquitobytes.spyonandroid.utilities;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import roboguice.inject.ContextSingleton;

import com.mozquitobytes.spyonandroid.interfaces.DataFromServerListener;
import com.mozquitobytes.spyonandroid.interfaces.ErrorListener;

@ContextSingleton
public class SocketClient  {
    private static final String MESSAGE_SEPARATOR = "\u0000";
    private String hostName;
    private int port;

    private Socket socket;
    private boolean disposed;
    
    public InputStream socketInputStream;
    public OutputStream socketOutputStream;
    
    private String latestMessageToSend;
    
    private ErrorListener errorListener;
    
    private DataFromServerListener dataFromServerListener;
    
    public SocketClient() {
        latestMessageToSend = "";
    }

    public void connect(String hostName, int port) {
        this.hostName = hostName;
        this.port = port;
        
        startConnectThread();
        startSendThread();
        startReadThread();
    }
    
    private void startConnectThread() {
        Thread connectThread = new Thread() {
            public void run() {
                doConnect();
            }
        };
        connectThread.start();
    }
    
    private void doConnect() {
        try {
            socket = new Socket(hostName, port);
        } catch (Exception e) {
            sendError(new IllegalStateException("Cannot connect", e));
            return;
        }
        if (!isConnected()) {
            sendError(new IllegalStateException("Cannot assign streams, socket is closed"));
            return;
        }

        try {
            socketInputStream = socket.getInputStream();
            socketOutputStream = socket.getOutputStream();
        } catch (IOException e) {
            sendError(new IllegalStateException("Cannot assign streams, IO exception occured", e));
            return;
        }
    }
    
    private void startSendThread() {
        Thread sendThread = new Thread() {
            public void run() {
                while(!disposed) {
                    String message = latestMessageToSend;
                    latestMessageToSend = null;
                    
                    if (message != null) {
                        doSend(message);
                    }
                    
                    sleepFor(20);
                }
            }
        };
        sendThread.start();
    }
    
    private void doSend(String message) {
        if (!isConnected()) {
            sendError(new IllegalStateException("Cannot write to stream, socket is closed"));
            return;
        }
        
        try {
            message += MESSAGE_SEPARATOR;
            socketOutputStream.write(message.getBytes());
        } catch (Exception e) {
            sendError(new IllegalStateException("Writing to stream failed", e));
        }
    }
    
    private void sleepFor(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            sendError(e);
        }
    }
    
    private void startReadThread() {
        Thread readThread = new Thread() {
            public void run() {
                while(!disposed) {
                    String message = readMessage();
                    if (message != null) {
                        sendMessage(message.trim());
                    }                  
                    sleepFor(20);
                }
            }
        };        
        readThread.start();
    }


    protected String readMessage() {
        if (!isConnected()) {
            sendError(new IllegalStateException("Cannot read from stream, socket is closed"));
        }

        try {
            byte[] buffer = new byte[1024];
            socketInputStream.read(buffer);
            return new String(buffer, "UTF-8");
        } catch (Exception e) {
            return null;
        }
    }

    protected void sendMessage(String message) {
        if (dataFromServerListener != null) {
            dataFromServerListener.onMessage(message);
        }
    }

    public void sendError(Throwable e) {
        if (errorListener != null) {
            errorListener.onError(e);
        }
    }
    
    public void dispose() {
        disposed = true;
    }
    
    public boolean isConnected() {
        return socket != null && socket.isConnected();
    }
    
    public void write(String message) {
        latestMessageToSend = message;
    }
    
    public void setOnErrorListener(ErrorListener errorListener) {
        this.errorListener = errorListener;
    }
    
    public void setOnDataFromServerListener(DataFromServerListener dataFromServerListener) {
        this.dataFromServerListener = dataFromServerListener;
    }
}