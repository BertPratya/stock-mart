import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupHandlers, startConnection, subscribeToStock } from './services/dataHubService';

const UpdateStockPrice = () => {
    const dispatch = useDispatch();
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
    const [localStockData, setLocalStockData] = useState<any[]>([]);

    // Get the complete state structure for debugging
    const state = useSelector((state: any) => state);
    
    // From your store.ts we can see you have a separate realTimePrice reducer
    const realTimePrice = useSelector((state: any) => state.realTimePrice);
    
    // Safely access properties with fallbacks and null checks
    const low = realTimePrice?.low !== undefined ? realTimePrice.low : null;
    const high = realTimePrice?.high !== undefined ? realTimePrice.high : null;
    const open = realTimePrice?.open !== undefined ? realTimePrice.open : null;
    const close = realTimePrice?.close !== undefined ? realTimePrice.close : null;
    const timeStamp = realTimePrice?.timeStamp || '';
    
    // Helper function to safely format numbers
    const formatNumber = (value: number | null): string => {
        return value !== null ? value.toFixed(2) : 'N/A';
    };

    useEffect(() => {
        let isMounted = true;

        const initializeConnection = async () => {
            try {
                await startConnection();
                if (!isMounted) return;
                
                await setupHandlers(dispatch);
                setConnectionStatus('connected');

                // Subscribe to specific stock IDs
                await subscribeToStock(317);
                await subscribeToStock(39);
                
                console.log("Successfully subscribed to stocks");
            } catch (error) {
                console.error("Failed to initialize SignalR:", error);
                if (isMounted) {
                    setConnectionStatus('failed');
                }
            }
        };

        initializeConnection();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    // Debug: log when price data changes
    useEffect(() => {
        if (realTimePrice) {
            console.log("Price data updated:", { 
                low, 
                high, 
                open, 
                close, 
                timeStamp
            });
            
            // Add to local state for history tracking
            if (open !== null || close !== null || low !== null || high !== null) {
                setLocalStockData(prev => [
                    ...prev, 
                    { 
                        timestamp: new Date().toISOString(),
                        open, 
                        close, 
                        low, 
                        high 
                    }
                ]);
            }
        }
    }, [realTimePrice, low, high, open, close, timeStamp]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Real-time Price Updates</h2>
            <p>Status: {connectionStatus === 'connected' ? 
                '✅ Connected to real-time updates' : 
                connectionStatus === 'connecting' ? 
                    '⏳ Connecting...' : 
                    '❌ Connection failed'}</p>
            
            <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa' 
            }}>
                <h3>Current Price Data</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Metric</th>
                            <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Open</td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>{formatNumber(open)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Close</td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>{formatNumber(close)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Low</td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>{formatNumber(low)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>High</td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>{formatNumber(high)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}>Last Updated</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {timeStamp ? new Date(timeStamp).toLocaleString() : 'N/A'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Debug section for Redux state */}
            <div style={{ marginTop: '20px' }}>
                <details>
                    <summary>Redux State</summary>
                    <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '10px', 
                        maxHeight: '300px', 
                        overflow: 'auto',
                        fontSize: '12px' 
                    }}>
                        {JSON.stringify(state, null, 2)}
                    </pre>
                </details>
            </div>
            
            {/* History of price updates */}
            <div style={{ marginTop: '20px' }}>
                <h3>Update History ({localStockData.length})</h3>
                {localStockData.length > 0 ? (
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Time</th>
                                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Open</th>
                                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Close</th>
                                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Low</th>
                                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>High</th>
                                </tr>
                            </thead>
                            <tbody>
                                {localStockData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '6px', borderBottom: '1px solid #eee' }}>
                                            {formatNumber(item.open)}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '6px', borderBottom: '1px solid #eee' }}>
                                            {formatNumber(item.close)}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '6px', borderBottom: '1px solid #eee' }}>
                                            {formatNumber(item.low)}
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '6px', borderBottom: '1px solid #eee' }}>
                                            {formatNumber(item.high)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No updates received yet</p>
                )}
            </div>
        </div>
    );
};

export default UpdateStockPrice;