import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from '../../theme';
import React, { useState,useEffect } from 'react';
import ChartBox from "./chartbox";
import RightPanel from "./rightPannel";
import PendingOrder from "./pendingOrder";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const TradingPage: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const graphFlex = 8;
    const [isPendingOrdersCollapsed, setIsPendingOrdersCollapsed] = useState(false);
    const togglePendingOrders = () => {
        setIsPendingOrdersCollapsed(!isPendingOrdersCollapsed);
    };

    
    useEffect(() => {
        // Small delay to ensure DOM updates before resize
        const timeoutId = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [isPendingOrdersCollapsed]);


    return (
        <Box display='flex' flexDirection='row' sx={{ overflow: 'hidden', flex: 1 }} height="100%">
            {/* Left side - Chart and floating button */}
            <Box flex={graphFlex} display="flex" flexDirection="column" height="100%" position="relative">
                {/* Make chart take all available height with proper padding for button */}
                <Box 
                    sx={{ 
                        flexGrow: 1,
                        height: '100%', 
                        position: 'relative',
                        paddingBottom: !isPendingOrdersCollapsed ? '60px' : '0',
                    }}
                >
                    <ChartBox isCollapsed ={isPendingOrdersCollapsed}/>
                </Box>
                
                {/* Remove this empty Box that's taking up space */}
                {/* <Box flex={isPendingOrdersCollapsed ? 7 : 1} sx={{ position: 'relative', paddingBottom: '20px' }}></Box> */}
                
                {/* Pending Orders Panel - Only show when not collapsed */}
                {isPendingOrdersCollapsed && (
                    <Box 
                    sx={{ 
                        height: '50%',
                        transition: 'height 0.3s ease',
                        paddingBottom: !isPendingOrdersCollapsed ? '60px' : '0',
                        flexDirection: 'column'
                    }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex"  flexGrow={1}>
                                <Typography variant="h5">Pending Orders</Typography>
                            </Box>
                            <Box 
                                onClick={togglePendingOrders}
                                sx={{ 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': { color: colors.greenAccent[400] }
                                }}
                            >
                                <Typography variant="body2" mr={0.5}>Hide</Typography>
                                <KeyboardArrowDownIcon fontSize="small" />
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            flex: 1,  // Take remaining space
                            overflow: 'auto', // Enable scrolling
                            px: 2, // Add padding
                            pb: 2,
                            
                        }}>
                            <PendingOrder />
                         </Box>
                    </Box>
                )}
                
                {/* Centered floating button */}
                {!isPendingOrdersCollapsed && (
                    <Box
                        onClick={togglePendingOrders}
                        sx={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)', 
                            backgroundColor: colors.primary[400],
                            color: colors.grey[100],
                            borderRadius: '20px',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', 
                            gap: '8px',
                            boxShadow: 3,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 10,
                            '&:hover': {
                                transform: 'translateX(-50%) translateY(-2px)',
                                boxShadow: 4,
                            }
                        }}
                    >
                        <Typography variant="body2" sx={{ lineHeight: 1 }}>Show Pending Order</Typography>
                        <KeyboardArrowUpIcon fontSize="small" />
                    </Box>
                )}
            </Box>
            
            {/* Right side - Order Panel */}
            <Box flex={10-graphFlex} height="100%">
                <RightPanel />
            </Box>
        </Box>
    );
};

export default TradingPage;



