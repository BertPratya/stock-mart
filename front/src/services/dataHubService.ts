import * as signalR from '@microsoft/signalr';
import { useDispatch } from 'react-redux';
import { setRealTimePrice } from '../redux/tradingSlice';
import { timeStamp } from 'node:console';
import { string } from 'yup';
import type { RootState } from '../redux/store';
import { setStock } from '../redux/tradingSlice';
import { UseDispatch, } from 'react-redux';
import { useState } from 'react';
import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
const tokens = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJnaXZlbl9uYW1lIjoidXNlciIsIm5iZiI6MTc0NDQ3Mjg4OSwiZXhwIjoxNzQ1MDc3Njg5LCJpYXQiOjE3NDQ0NzI4ODksImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTA5MiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTA5MiJ9.mGx7_1fvDZsAupd4Vxf8YHZ2sf6o1OJYkCnLHbhHHYPix-QWe6bGO7BACRe-bGGhC6G_6KgAePnWhPy8ETVwhA";



const hubUrl = "http://localhost:5092/chart";

let isConnecting = false;
let connectionPromise: Promise<signalR.HubConnection> | null = null;

const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
        accessTokenFactory: () => tokens
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export async function startConnection(): Promise<signalR.HubConnection> {
    if (connectionPromise) {
        return connectionPromise;
    }
    
    if (connection.state === signalR.HubConnectionState.Connected) {
        return Promise.resolve(connection);
    }
    
    connectionPromise = (async () => {
        try {
            isConnecting = true;
            await connection.start();
            console.log("SignalR connected successfully");
            return connection;
        } catch(err) {
            console.error("Connection failed:", err);
            connectionPromise = null;
            throw err;
        } finally {
            isConnecting = false;
        }
    })();
    
    return connectionPromise;
}

connection.onclose(async () => {
    console.log("Disconnected. Attempting to reconnect...");
    connectionPromise = null; 
    try {
        await startConnection();
    } catch (err) {
        console.error("Reconnection failed:", err);
    }
});

// Set up handlers after connection is established
export async function setupHandlers(dispatch: any) {
    try {
        const conn = await startConnection();
        
        conn.off("ReceivePriceUpdate");
        
        conn.on("ReceivePriceUpdate", (stockId: number, open: number, close: number, low: number, high: number, timeStamp: string) => {
            // console.log(`Received update for stock ${stockId}: Open=${open}, Close=${close}, Low=${low}, High=${high}`);
            


            dispatch(setRealTimePrice({ 
                stockId, 
                open: open,  
                close: close, 
                low: low,  
                high: high,
                timeStamp: timeStamp 
            }));
        });
        
        return conn;
    } catch (err) {
        console.error("Failed to setup handlers:", err);
        throw err;
    }
}

// Subscribe to stock updates
export const subscribeToStock = async (stockId: number) => {
    try {
      await connection.invoke("SubscribeToStock", stockId);
      console.log(`Subscribed to stock ${stockId}`);
    } catch (error) {
      console.error("Error from subscription:", error);
    }
  };


export async function unsubscribeFromStock(stockId: number) {
    if (connection.state !== signalR.HubConnectionState.Connected) {
        console.log("Not unsubscribing: connection not active");
        return false;
    }
    try {
        await connection.invoke("UnsubscribeFromStock", stockId);
        console.log(`Successfully unsubscribed from stock ${stockId}`);
        return true;
    } catch(error) {
        console.error("Error unsubscribing:", error);
        return false;
    }
}

// Remove from subscribers list
export async function removeFromSubscriber() {
    try {
        const conn = await startConnection();
        await conn.invoke("Signout");
        console.log("Successfully signed out from subscribers list.");
        return true;
    } catch(error) {
        console.error("Error signing out from subscribers list:", error);
        return false;
    }
}

export function isConnected(): boolean {
    return connection.state === signalR.HubConnectionState.Connected;
}

export { connection };