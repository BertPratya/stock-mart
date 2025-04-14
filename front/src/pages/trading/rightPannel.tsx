import React, { useState, useEffect } from 'react';
import { 
    Box, Button, TextField, Typography, Select, MenuItem,
    FormControl, InputLabel, InputAdornment, Paper,
    ToggleButtonGroup, ToggleButton, useTheme 
} from '@mui/material';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';

import { tokens } from '../../theme';
import { setStock } from '../../redux/tradingSlice';
import type { RootState, AppDispatch } from '../../redux/store';

// --------------------------------------------------
// Interfaces
// --------------------------------------------------

interface TradeFormValues {
  tradeType: 'buy' | 'sell';
  orderType: string;
  quantity: string;
  pendingPrice: string;
}

// --------------------------------------------------
// Component
// --------------------------------------------------

const RightPanel: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Redux state
    const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
    const stockId = useTypedSelector((state: RootState) => state.trading.stockId);
    const symbol = useTypedSelector((state) => state.trading.symbol);
    const name = useTypedSelector((state) => state.trading.companyName);
    const sharesAvailable = useTypedSelector((state) => state.trading.availableShares);
    const price = useTypedSelector((state) => state.trading.price);

    // Local state
    const [stockPrice, setStockPrice] = useState<number>(150.25);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Initial form values
    const initialValues: TradeFormValues = {
        tradeType: 'buy',
        orderType: 'market',
        quantity: '',
        pendingPrice: stockPrice.toString(),
    };

    // Validation schema
    const validationSchema = Yup.object({
        quantity: Yup.number()
            .typeError('Quantity must be a number')
            .required('Quantity is required')
            .positive('Quantity must be greater than 0')
            .integer('Quantity must be a whole number'),
        pendingPrice: Yup.number()
            .typeError('Price must be a number')
            .required('Price is required')
            .positive('Price must be greater than 0'),
    });

    // Effect to update stock price and total when stockId changes
    useEffect(() => {
        console.log(symbol);
        setStockPrice(price);
        setTotalPrice(calculateTotal(initialValues));
    }, [stockId]);

    // Sync pendingPrice when stockPrice updates
    useEffect(() => {
        initialValues.pendingPrice = stockPrice.toString();
    }, [stockPrice]);

    // Calculate total based on form values
    const calculateTotal = (values: TradeFormValues) => {
        const qty = values.quantity ? parseFloat(values.quantity) : 0;
        const effectivePrice = values.orderType === 'market'
            ? stockPrice
            : (values.pendingPrice ? parseFloat(values.pendingPrice) : 0);

        return qty * effectivePrice;
    };

    // --------------------------------------------------
    // JSX Return
    // --------------------------------------------------

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }: FormikHelpers<TradeFormValues>) => {
                const total = calculateTotal(values);

                alert(`Order placed: ${values.tradeType} ${values.quantity} shares at $${values.orderType === 'market' 
                    ? stockPrice.toFixed(2) 
                    : parseFloat(values.pendingPrice).toFixed(2)} for a total of $${total.toFixed(2)}`);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit, isValid }) => {

                // Update total whenever form values change
                useEffect(() => {
                    setTotalPrice(calculateTotal(values));
                }, [values]);

                return (
                    <Form>
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
                            {/* Trade Type Toggle */}
                            <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'center', bgcolor: colors.primary[400], mb: 2 }}>
                                <ToggleButtonGroup
                                    value={values.tradeType}
                                    exclusive
                                    onChange={(_, newTradeType) => {
                                        if (newTradeType) {
                                            setFieldValue('tradeType', newTradeType);
                                        }
                                    }}
                                    sx={{ width: '100%' }}
                                >
                                    <ToggleButton
                                        value="buy"
                                        sx={{
                                            flex: 1,
                                            bgcolor: values.tradeType === 'buy' ? colors.greenAccent[500] : 'transparent',
                                            color: values.tradeType === 'buy' ? '#fff' : colors.grey[100],
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
                                        sx={{
                                            flex: 1,
                                            bgcolor: values.tradeType === 'sell' ? colors.redAccent[500] : 'transparent',
                                            color: values.tradeType === 'sell' ? '#fff' : colors.grey[100],
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

                            {/* Order Type Select */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Order Type</InputLabel>
                                <Select
                                    name="orderType"
                                    value={values.orderType}
                                    onChange={handleChange}
                                    label="Order Type"
                                >
                                    <MenuItem value="market">Market Order</MenuItem>
                                    <MenuItem value="limit">Limit Order</MenuItem>
                                    <MenuItem value="stop">Stop Order</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Price Input (Limit or Stop) */}
                            {values.orderType !== 'market' && (
                                <Field name="pendingPrice">
                                    {({ field }: FieldProps) => (
                                        <FormControl fullWidth error={touched.pendingPrice && Boolean(errors.pendingPrice)}>
                                            <TextField
                                                {...field}
                                                label={values.orderType === 'limit' ? "Limit Price" : "Stop Price"}
                                                variant="outlined"
                                                type="text"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                error={touched.pendingPrice && Boolean(errors.pendingPrice)}
                                                helperText={touched.pendingPrice && errors.pendingPrice}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </FormControl>
                                    )}
                                </Field>
                            )}

                            {/* Quantity Input */}
                            <Field name="quantity">
                                {({ field }: FieldProps) => (
                                    <FormControl fullWidth error={touched.quantity && Boolean(errors.quantity)}>
                                        <TextField
                                            {...field}
                                            label="Quantity"
                                            variant="outlined"
                                            type="text"
                                            error={touched.quantity && Boolean(errors.quantity)}
                                            helperText={touched.quantity && errors.quantity}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </FormControl>
                                )}
                            </Field>

                            {/* Summary Section */}
                            <Box sx={{ p: 2, bgcolor: colors.primary[900], borderRadius: 1, mt: 2 }}>
                                <Typography variant="body2" color={colors.grey[300]}>
                                    Current Price:
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    ${stockPrice.toFixed(2)}
                                </Typography>

                                {values.orderType !== 'market' && (
                                    <>
                                        <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 1 }}>
                                            {values.orderType === 'limit' ? 'Limit' : 'Stop'} Price:
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            ${values.pendingPrice ? parseFloat(values.pendingPrice).toFixed(2) : '0.00'}
                                        </Typography>
                                    </>
                                )}

                                <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 2 }}>
                                    Total {values.tradeType === 'buy' ? 'Cost' : 'Value'}:
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    color={values.tradeType === 'buy' ? colors.greenAccent[400] : colors.redAccent[400]}
                                >
                                    ${totalPrice.toFixed(2)}
                                </Typography>
                            </Box>

                            {/* Submit */}
                            <Button
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={!isValid}
                                sx={{
                                    mt: 'auto',
                                    bgcolor: values.tradeType === 'buy' ? colors.greenAccent[500] : colors.redAccent[500],
                                    color: '#fff',
                                    '&:hover': {
                                        bgcolor: values.tradeType === 'buy' ? colors.greenAccent[600] : colors.redAccent[600],
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: colors.grey[700],
                                        color: colors.grey[300]
                                    }
                                }}
                            >
                                {values.tradeType === 'buy' ? 'BUY' : 'SELL'} ORDER
                            </Button>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default RightPanel;
