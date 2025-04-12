import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Select, 
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    useTheme
} from '@mui/material';
import { tokens } from '../../theme';

const RightPanel: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // States for form controls
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState('market');
    const [quantity, setQuantity] = useState<number>(0);
    const [stockPrice, setStockPrice] = useState<number>(150.25);
    const [pendingPrice, setPendingPrice] = useState<number>(stockPrice);
    
    // Calculate total price
    const [totalPrice, setTotalPrice] = useState<number>(0);
    
    useEffect(() => {
        // Use pending price for limit/stop orders, current price for market orders
        const priceToUse = orderType === 'market' ? stockPrice : pendingPrice;
        setTotalPrice(quantity * priceToUse);
    }, [quantity, stockPrice, pendingPrice, orderType]);
    
    // Update pending price when stock price changes
    useEffect(() => {
        setPendingPrice(stockPrice);
    }, [stockPrice]);
    
    const handleTradeTypeChange = (
        _: React.MouseEvent<HTMLElement>, 
        newTradeType: 'buy' | 'sell'
    ) => {
        if (newTradeType !== null) {
            setTradeType(newTradeType);
        }
    };
    
    const handleOrderTypeChange = (event: any) => {
        setOrderType(event.target.value);
    };
    
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setQuantity(isNaN(value) ? 0 : value);
    };
    
    const handlePendingPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setPendingPrice(isNaN(value) ? 0 : value);
    };

    return (
        <Box 
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                gap: 3,
                bgcolor: "transparent",
                borderRadius: 1
            }}
        >
            {/* Buy/Sell Toggle Buttons */}
            <Paper 
                elevation={0}
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    bgcolor: colors.primary[400],
                    mb: 2
                }}
            >
                <ToggleButtonGroup
                    value={tradeType}
                    exclusive
                    onChange={handleTradeTypeChange}
                    aria-label="trade type"
                    sx={{ width: '100%' }}
                >
                    <ToggleButton 
                        value="buy" 
                        aria-label="buy"
                        sx={{ 
                            flex: 1,
                            bgcolor: tradeType === 'buy' ? colors.greenAccent[500] : 'transparent',
                            color: tradeType === 'buy' ? '#fff' : colors.grey[100],
                            '&.Mui-selected': {
                                bgcolor: colors.greenAccent[500],
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: colors.greenAccent[600],
                                }
                            }
                        }}
                    >
                        BUY
                    </ToggleButton>
                    <ToggleButton 
                        value="sell" 
                        aria-label="sell"
                        sx={{ 
                            flex: 1,
                            bgcolor: tradeType === 'sell' ? colors.redAccent[500] : 'transparent',
                            color: tradeType === 'sell' ? '#fff' : colors.grey[100],
                            '&.Mui-selected': {
                                bgcolor: colors.redAccent[500],
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: colors.redAccent[600],
                                }
                            }
                        }}
                    >
                        SELL
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>

            {/* Order Type Selection */}
            <FormControl fullWidth variant="outlined">
                <InputLabel>Order Type</InputLabel>
                <Select
                    value={orderType}
                    onChange={handleOrderTypeChange}
                    label="Order Type"
                >
                    <MenuItem value="market">Market Order</MenuItem>
                    <MenuItem value="limit">Limit Order</MenuItem>
                    <MenuItem value="stop">Stop Order</MenuItem>
                </Select>
            </FormControl>

            {/* Pending Price Input - only show for limit and stop orders */}
            {orderType !== 'market' && (
                <TextField
                    label={orderType === 'limit' ? "Limit Price" : "Stop Price"}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={pendingPrice}
                    onChange={handlePendingPriceChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { 
                            min: 0,
                            step: 0.01
                        },
                    }}
                />
            )}

            {/* Stock Quantity Input */}
            <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{
                    inputProps: { min: 0 },
                }}
            />

            {/* Total Price Display */}
            <Box 
                sx={{ 
                    p: 2, 
                    bgcolor: colors.primary[900],
                    borderRadius: 1,
                    mt: 2 
                }}
            >
                <Typography variant="body2" color={colors.grey[300]}>
                    Current Price:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                    ${stockPrice.toFixed(2)}
                </Typography>
                
                {orderType !== 'market' && (
                    <>
                        <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 1 }}>
                            {orderType === 'limit' ? 'Limit' : 'Stop'} Price:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            ${pendingPrice.toFixed(2)}
                        </Typography>
                    </>
                )}
                
                <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 2 }}>
                    Total {tradeType === 'buy' ? 'Cost' : 'Value'}:
                </Typography>
                <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    color={tradeType === 'buy' ? colors.greenAccent[400] : colors.redAccent[400]}
                >
                    ${totalPrice.toFixed(2)}
                </Typography>
            </Box>
            
            {/* Submit Button */}
            <Button
                variant="contained"
                size="large"
                sx={{
                    mt: 'auto',
                    bgcolor: tradeType === 'buy' ? colors.greenAccent[500] : colors.redAccent[500],
                    color: '#fff',
                    '&:hover': {
                        bgcolor: tradeType === 'buy' ? colors.greenAccent[600] : colors.redAccent[600],
                    }
                }}
            >
                {tradeType === 'buy' ? 'BUY' : 'SELL'} ORDER
            </Button>
        </Box>
    );
};

export default RightPanel;