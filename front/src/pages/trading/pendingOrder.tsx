import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const PendingOrder: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [orders, setOrders] = React.useState([
        { id: 1, name: 'AAPL', qty: 10, totalPrice: 1500, status: 'Pending', statusColor: colors.grey[300] },
        { id: 2, name: 'GOOGL', qty: 5, totalPrice: 1200, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 3, name: 'MSFT', qty: 8, totalPrice: 1000, status: 'Cancelled', statusColor: colors.redAccent[500] },
        { id: 4, name: 'AMZN', qty: 12, totalPrice: 2200, status: 'Pending', statusColor: colors.grey[300] },
        { id: 5, name: 'TSLA', qty: 3, totalPrice: 1800, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 6, name: 'NVDA', qty: 15, totalPrice: 3000, status: 'Pending', statusColor: colors.grey[300] },
        { id: 7, name: 'META', qty: 7, totalPrice: 1700, status: 'Cancelled', statusColor: colors.redAccent[500] },
        { id: 8, name: 'AMD', qty: 20, totalPrice: 2400, status: 'Pending', statusColor: colors.grey[300] },
        { id: 9, name: 'INTC', qty: 15, totalPrice: 750, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 10, name: 'NFLX', qty: 4, totalPrice: 1900, status: 'Pending', statusColor: colors.grey[300] },
        { id: 11, name: 'DIS', qty: 10, totalPrice: 1100, status: 'Cancelled', statusColor: colors.redAccent[500] },
        { id: 12, name: 'BABA', qty: 25, totalPrice: 2800, status: 'Pending', statusColor: colors.grey[300] },
        { id: 13, name: 'PYPL', qty: 12, totalPrice: 1450, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 14, name: 'ADBE', qty: 6, totalPrice: 3200, status: 'Cancelled', statusColor: colors.redAccent[500] },
        { id: 15, name: 'CRM', qty: 9, totalPrice: 2100, status: 'Pending', statusColor: colors.grey[300] },
        { id: 16, name: 'CSCO', qty: 18, totalPrice: 980, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 17, name: 'PEP', qty: 14, totalPrice: 2400, status: 'Pending', statusColor: colors.grey[300] },
        { id: 18, name: 'KO', qty: 22, totalPrice: 1300, status: 'Cancelled', statusColor: colors.redAccent[500] },
        { id: 19, name: 'WMT', qty: 11, totalPrice: 1650, status: 'Completed', statusColor: colors.greenAccent[500] },
        { id: 20, name: 'JNJ', qty: 8, totalPrice: 1400, status: 'Pending', statusColor: colors.grey[300] },
    ]);

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
                overflow: 'hidden'
            }}
        >
            <TableContainer 

                sx={{

                    maxHeight: '400px', // Add fixed max height
                    height: '100%',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: colors.grey[900], // Add track background

                    },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '4px',
                        '&:hover': {
                        }
                    },
                }}
            >
                <Table stickyHeader size="small">
                <TableHead>
            <TableRow>
                <TableCell 
                    sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white', // Check for dark mode
                        borderBottom: `1px solid ${colors.grey[800]}`, // Keep border for separation
                        color: colors.grey[100], // Keep text visible
                        position: 'sticky', // Ensure sticky positioning
                        top: 0, // Stick to the top of the container
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
                        backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white', // Check for dark mode
                        borderBottom: `1px solid ${colors.grey[800]}`,
                        position: 'sticky', // Ensure sticky positioning
                        top: 0, // Stick to the top of the container
                        zIndex: 1
                    }}
                >
                    Qty
                </TableCell>
                <TableCell 
                    align="right" 
                    sx={{ 
                        color: colors.grey[100],
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white', // Check for dark mode
                        borderBottom: `1px solid ${colors.grey[800]}`,
                        position: 'sticky', // Ensure sticky positioning
                        top: 0, // Stick to the top of the container
                        zIndex: 1
                    }}
                >
                    Price
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        color: colors.grey[100],
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white', // Check for dark mode
                        borderBottom: `1px solid ${colors.grey[800]}` ,
                        position: 'sticky', // Ensure sticky positioning
                        top: 0, // Stick to the top of the container
                        zIndex: 1
                    }}
                >
                    Status
                </TableCell>
                <TableCell 
                    align="center" 
                    sx={{ 
                        color: colors.grey[100],
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : 'white', // Check for dark mode
                        borderBottom: `1px solid ${colors.grey[800]}`,
                        position: 'sticky', // Ensure sticky positioning
                        top: 0, // Stick to the top of the container
                        zIndex: 1
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
                                        color: order.statusColor,
                                        fontWeight: 'medium'
                                    }}
                                >
                                    {order.status}
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
                                        Remove
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