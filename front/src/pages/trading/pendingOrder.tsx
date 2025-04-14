import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const PendingOrder: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const getRelativeTime = (dateString: string) => {
        const orderDate = new Date(dateString);
        const diffMs = currentTime.getTime() - orderDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays < 30) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return orderDate.toLocaleDateString();
        }
    };

    const formatExactTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getOrderTime = (minutesAgo: number) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - minutesAgo);
        return date.toISOString();
    };

    const [orders, setOrders] = useState([
        { id: 1, name: 'AAPL', qty: 10, totalPrice: 1500, timestamp: getOrderTime(5), type: 'buy' },
        { id: 2, name: 'GOOGL', qty: 5, totalPrice: 1200, timestamp: getOrderTime(15), type: 'sell' },
        { id: 3, name: 'MSFT', qty: 8, totalPrice: 1000, timestamp: getOrderTime(30), type: 'buy' },
        { id: 4, name: 'AMZN', qty: 12, totalPrice: 2200, timestamp: getOrderTime(45), type: 'sell' },
        { id: 5, name: 'TSLA', qty: 3, totalPrice: 1800, timestamp: getOrderTime(55), type: 'buy' },
        { id: 6, name: 'NVDA', qty: 15, totalPrice: 3000, timestamp: getOrderTime(70), type: 'sell' },
        { id: 7, name: 'META', qty: 7, totalPrice: 1700, timestamp: getOrderTime(90), type: 'buy' },
        { id: 8, name: 'AMD', qty: 20, totalPrice: 2400, timestamp: getOrderTime(120), type: 'sell' },
        { id: 9, name: 'INTC', qty: 15, totalPrice: 750, timestamp: getOrderTime(150), type: 'buy' },
        { id: 10, name: 'NFLX', qty: 4, totalPrice: 1900, timestamp: getOrderTime(180), type: 'sell' },
        { id: 11, name: 'DIS', qty: 10, totalPrice: 1100, timestamp: getOrderTime(210), type: 'buy' },
        { id: 12, name: 'BABA', qty: 25, totalPrice: 2800, timestamp: getOrderTime(240), type: 'sell' },
        { id: 13, name: 'PYPL', qty: 12, totalPrice: 1450, timestamp: getOrderTime(300), type: 'buy' },
        { id: 14, name: 'ADBE', qty: 6, totalPrice: 3200, timestamp: getOrderTime(360), type: 'sell' },
        { id: 15, name: 'CRM', qty: 9, totalPrice: 2100, timestamp: getOrderTime(420), type: 'buy' },
        { id: 16, name: 'CSCO', qty: 18, totalPrice: 980, timestamp: getOrderTime(480), type: 'sell' },
        { id: 17, name: 'PEP', qty: 14, totalPrice: 2400, timestamp: getOrderTime(540), type: 'buy' },
        { id: 18, name: 'KO', qty: 22, totalPrice: 1300, timestamp: getOrderTime(600), type: 'sell' },
        { id: 19, name: 'WMT', qty: 11, totalPrice: 1650, timestamp: getOrderTime(660), type: 'buy' },
        { id: 20, name: 'JNJ', qty: 8, totalPrice: 1400, timestamp: getOrderTime(720), type: 'sell' },
    ]);

    // Remove order handler
    const removeOrder = (id: number) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    };

    return (
        <Box
            sx={{
                height: '100%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <TableContainer
                sx={{
                    maxHeight: '400px',
                    height: '100%',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: colors.grey[900],
                    },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '4px',
                        backgroundColor: colors.grey[700],
                        '&:hover': {
                            backgroundColor: colors.grey[600],
                        },
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white',
                                    borderBottom: `1px solid ${colors.grey[800]}`,
                                    color: colors.grey[100],
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Stock
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white',
                                    borderBottom: `1px solid ${colors.grey[800]}`,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Qty
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white',
                                    borderBottom: `1px solid ${colors.grey[800]}`,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Price
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white',
                                    borderBottom: `1px solid ${colors.grey[800]}`,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Time
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white',
                                    borderBottom: `1px solid ${colors.grey[800]}`,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell sx={{ borderBottom: `1px solid ${colors.grey[800]}` }}>
                                    {order.name}
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: `1px solid ${colors.grey[800]}` }}>
                                    {order.qty}
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: `1px solid ${colors.grey[800]}` }}>
                                    ${order.totalPrice.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        borderBottom: `1px solid ${colors.grey[800]}`,
                                        color: colors.grey[100],
                                        fontWeight: 'medium',
                                    }}
                                >
                                    {getRelativeTime(order.timestamp)}
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${colors.grey[800]}` }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        onClick={() => removeOrder(order.id)}
                                        sx={{
                                            minWidth: '30px',
                                            fontSize: '0.7rem',
                                            py: 0.5,
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PendingOrder;
