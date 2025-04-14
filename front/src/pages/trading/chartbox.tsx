
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import SearchBar from './searchbar';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { setupHandlers, startConnection, subscribeToStock,unsubscribeFromStock } from '../../services/dataHubService';
import type { RootState } from '../../redux/store';
import { getStockPriceHistory } from '../../services/tradingService';
import { initial } from 'lodash';
import { timeStamp } from 'console';
interface ChartBoxProps {
    isCollapsed?: boolean;
}

const formatShareCount = (shares?: number): string => {
    if (shares === undefined || shares === null) return 'N/A';
    if (shares < 1000) return shares.toString();
    if (shares < 1000000) return `${(shares / 1000).toFixed(2)}K`;
    return `${(shares / 1000000).toFixed(2)}M`;
};

const ChartBox: React.FC<ChartBoxProps> = ({ isCollapsed }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const chartContainer = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const seriesRef = useRef<any>(null);

    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const dispatch = useDispatch();

    const stockId = useTypedSelector((state) => state.trading.stockId);
    const symbol = useTypedSelector((state) => state.trading.symbol);
    const name = useTypedSelector((state) => state.trading.companyName);
    const sharesAvailable = useTypedSelector((state) => state.trading.availableShares);
    const price = useTypedSelector((state) => state.trading.price);
    const realTimePrice = useSelector((state: any) => state.realTimePrice);

    const [isSearchBarAppear, setSearchBarAppear] = useState(false);
    const [currentStock, setCurrentStock] = useState({ symbol: "AAPL", name: "Apple Inc.", sharesAvailable: 1200, price: 150 });

    const toggleSearchBar = () => setSearchBarAppear((prev) => !prev);

    useEffect(() => {
        const nextStock = { symbol, name, sharesAvailable, price };
        setCurrentStock(nextStock);
    }, [symbol, name, sharesAvailable, price]);

    const prevStockIdRef = useRef<number>(-999);

    // Then modify the effect
    useEffect(() => {
        let isMounted = true;
        
        const handleStockSubscription = async () => {
            if (stockId === -999) return;
            
            try {
                await startConnection();
                if (!isMounted) return;
                
                await setupHandlers(dispatch);
                
                // Unsubscribe from previous stock ID if it was valid
                const prevStockId = prevStockIdRef.current;
                if (prevStockId !== -999 && prevStockId !== stockId) {
                    await unsubscribeFromStock(prevStockId);
                    console.log(`Unsubscribed from previous stock ${prevStockId}`);
                }
                
                // Subscribe to new stock
                await subscribeToStock(stockId);
                
                // Update reference to current stock ID
                prevStockIdRef.current = stockId;
                
            } catch (error) {
                console.error("Failed to manage stock subscriptions:", error);
            }
        };
        
        handleStockSubscription();
        
        return () => { 
            isMounted = false;
        };
    }, [stockId, dispatch]);

    useEffect(() => {
        if (!chartContainer.current || chartRef.current || stockId === -999) return; 
    
        const chart = createChart(chartContainer.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: colors.grey[400],
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
            },
            grid: {
                vertLines: { color: colors.primary[400] },
                horzLines: { color: colors.primary[400] },
            },
            width: chartContainer.current.clientWidth,
            height: chartContainer.current.clientHeight,
        });
    
        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
    
        chartRef.current = chart;
        seriesRef.current = series;
    
        const loadInitialData = async () => {
            try {
                const stockHistory = await getStockPriceHistory(stockId);
                const formattedData = stockHistory.map((item: any) => ({
                    time: Math.floor(new Date(item.timeStamp).getTime() / 1000),
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }));
    
                series.setData(formattedData);
                chart.timeScale().fitContent();
            } catch (error) {
                console.error('Error loading initial chart data:', error);
            }
        };
    
        loadInitialData();
    
        return () => {
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, [theme.palette.mode, isCollapsed, stockId]);
    
    useEffect(() => {
        if (realTimePrice?.open != null) {
            setCurrentStock((prevStock) => ({
                ...prevStock,
                price: realTimePrice.open,
            }));
        }
    }, [realTimePrice?.open]);



    

    useEffect(() => {
        const { low, high, open, close, timeStamp } = realTimePrice || {};
        if (low != null && high != null && open != null && close != null && timeStamp && seriesRef.current) {
            const unixTime = Math.floor(new Date(timeStamp).getTime() / 1000);
            const newCandle = { time: unixTime, open, high, low, close };
            seriesRef.current.update(newCandle); 
        }
    }, [realTimePrice]);

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }} display='flex'>
            <Box onClick={toggleSearchBar}
                sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: colors.primary[900],
                    color: colors.grey[100],
                    padding: '8px 12px',
                    borderRadius: '4px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    zIndex: 10,
                    cursor: 'pointer'
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {currentStock.name} ({currentStock.symbol})
                </Typography>
                <Typography variant="body2">Price: ${currentStock.price.toFixed(2)}</Typography>
                <Typography variant="body2">Shares Available: {formatShareCount(currentStock.sharesAvailable)}</Typography>
            </Box>

            {isSearchBarAppear && <SearchBar />}

            <Box display='flex'
                onClick={isSearchBarAppear ? toggleSearchBar : undefined}
                ref={chartContainer}
                sx={{ width: '100%', height: '100%', position: 'relative' }}
            />
        </Box>
    );
};

export default ChartBox;
