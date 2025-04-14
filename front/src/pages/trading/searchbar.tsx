import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, IconButton, useTheme, Tooltip, Typography, Button, List, ListItem, Divider, Pagination } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import { getStockQuery } from "../../services/tradingService";
import { useDispatch, UseDispatch } from 'react-redux';
import { setStock } from '../../redux/tradingSlice';
interface StockData {
  id: number;
  symbol: string;
  companyName: string;
  industry: string;
  exchange: string;
  description: string;
  totalShares: number;
}

interface StockQuote {
  stockQuoteId: number;
  stockId: number;
  currentPrice: number;
  availableShares: number;
  lastUpdated: string;
}

interface ApiStockResponse {
  stock: StockData;
  stockQuote: StockQuote;
}

interface StockItem {
    id?: number;
    symbol: string;
    name: string;
    price?: number;
    favorite?: boolean;
    industry?: string;
    exchange?: string;
    stockQuote?: {
        stockQuoteId: number;
        stockId: number;
        currentPrice: number;
        availableShares: number;
        lastUpdated: string;
    };
}



const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const processingRef = useRef(false);
    const [query, setQuery] = useState('');
    const [allStocks, setAllStocks] = useState<StockItem[]>([]);
    const [displayedStocks, setDisplayedStocks] = useState<StockItem[]>([]);
    const [showingFavorites, setShowingFavorites] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState("Symbol");
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 15; 

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            performSearch('', sortBy, showingFavorites);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [sortBy, showingFavorites]);

    useEffect(() => {
        updateDisplayedStocks();
    }, [page, allStocks]);

    const updateDisplayedStocks = useCallback(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedStocks(allStocks.slice(startIndex, endIndex));
    }, [page, allStocks, itemsPerPage]);


    const handleStockClick = (stock: StockItem) => {
        dispatch(setStock({
            stockId: stock.id,
            symbol: stock.symbol,
            companyName: stock.name,
            price: stock.stockQuote?.currentPrice,
            availableShares: stock.stockQuote?.availableShares
        }))
    }

    
    const performSearch = async (searchValue: string, sortCriteria: string, showFavoritesOnly: boolean) => {
        if (processingRef.current) return; 
        
        processingRef.current = true;
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 0));
            
            const result = await getStockQuery(searchValue, sortCriteria, false, 1, 1000);
            console.log(result);
            if (result && Array.isArray(result) && result.length > 0) {
                const processedResults: StockItem[] = result.map((item: ApiStockResponse) => {
                    return {
                        id: item.stock.id,
                        symbol: item.stock.symbol,
                        name: item.stock.companyName,
                        price: item.stockQuote?.currentPrice || 0,
                        favorite: favorites.has(item.stock.id),
                        industry: item.stock.industry,
                        exchange: item.stock.exchange,
                        // Store the full stockQuote object
                        stockQuote: item.stockQuote ? { 
                            stockQuoteId: item.stockQuote.stockQuoteId,
                            stockId: item.stockQuote.stockId,
                            currentPrice: item.stockQuote.currentPrice,
                            availableShares: item.stockQuote.availableShares,
                            lastUpdated: item.stockQuote.lastUpdated
                        } : undefined
                    };
                });
                
                const filteredResults = showFavoritesOnly 
                    ? processedResults.filter(stock => favorites.has(stock.id || 0))
                    : processedResults;
                
                setAllStocks(filteredResults);
                setTotalPages(Math.max(1, Math.ceil(filteredResults.length / itemsPerPage)));
                
                setPage(1);
            } else {
                setAllStocks([]);
                setTotalPages(1);
                setPage(1);
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setAllStocks([]);
            setTotalPages(1);
            setPage(1);
        } finally {
            processingRef.current = false;
            setIsLoading(false);
        }
    };

    const debouncedSearch = useCallback((searchValue: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
            performSearch(searchValue, sortBy, showingFavorites);
        }, 500);
    }, [sortBy, showingFavorites]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        
        if (newQuery.length >= 2) {
            debouncedSearch(newQuery);
        } else if (newQuery.length === 0) {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            
            setTimeout(() => {
                performSearch('', sortBy, showingFavorites);
            }, 300);
        }
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = event.target.value;
        setSortBy(newSortBy);
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        // Schedule search with the new sort value
        setTimeout(() => {
            performSearch(query, newSortBy, showingFavorites);
        }, 0);
    };

    const toggleFavorite = (id: number | undefined) => {
        if (id === undefined) return;
        
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
        
        setAllStocks(allStocks.map(stock => 
            stock.id === id ? { ...stock, favorite: !stock.favorite } : stock
        ));
        
        if (showingFavorites && newFavorites.has(id) === false) {
            const updatedAllStocks = allStocks.filter(stock => 
                stock.id !== id || newFavorites.has(stock.id || 0)
            );
            setAllStocks(updatedAllStocks);
            setTotalPages(Math.max(1, Math.ceil(updatedAllStocks.length / itemsPerPage)));
            
            if ((page - 1) * itemsPerPage >= updatedAllStocks.length && page > 1) {
                setPage(page - 1);
            }
        }
    };

    const formatPrice = (price?: number) => {
        return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box 
            display="flex" 
            flexDirection="column"
            sx={{ 
                backgroundColor: colors.primary[900], 
                position: 'absolute',
                top: '53%',
                left: '16.1%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '75%', sm: '50%', md: '40%', lg: '30%' },
                height: { xs: '400px', sm: '450px' },
                maxHeight: '65vh',
                padding: '10px',
                zIndex: 12,
                borderRadius: '8px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden'
            }}
        >
            <Box display="flex" alignItems="center" mb={1}>
                <InputBase 
                    sx={{ 
                        flex: 1, 
                        backgroundColor: colors.primary[800], 
                        borderRadius: '4px', 
                        padding: '6px 8px',
                        fontSize: '0.9rem',
                        pl: 1,
                        '& .MuiSvgIcon-root': {
                            color: colors.grey[300],
                            mr: 1
                        }
                    }} 
                    placeholder="Search stocks..." 
                    value={query} 
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && debounceTimerRef.current) {
                            clearTimeout(debounceTimerRef.current);
                            performSearch(query, sortBy, showingFavorites);
                        }
                    }}
                    startAdornment={
                        <SearchIcon fontSize="small" />
                    }
                    endAdornment={
                        isLoading ? (
                            <Box sx={{ display: 'inline-block', width: '16px', height: '16px', mr: 1 }}>
                                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: colors.grey[400] }}>
                                    ...
                                </Typography>
                            </Box>
                        ) : null
                    }
                />
            </Box>
            <Divider sx={{ backgroundColor: colors.primary[600], my: 0.75 }} />

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box>
                    <select 
                        style={{
                            padding: '5px 8px', 
                            borderRadius: '4px',
                            backgroundColor: colors.primary[800],
                            color: theme.palette.mode === 'dark' ? 'white' : 'black',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="Symbol">Sort by Name</option>
                        <option value="Price">Sort by Price</option>
                    </select>
                </Box>
                
                <Button
                    startIcon={<FavoriteIcon fontSize="small" />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                        const newState = !showingFavorites;
                        setShowingFavorites(newState);
                        
                        if (debounceTimerRef.current) {
                            clearTimeout(debounceTimerRef.current);
                        }
                        performSearch(query, sortBy, newState);
                    }}
                    sx={{
                        backgroundColor: showingFavorites ? colors.greenAccent[600] : colors.primary[700],
                        '&:hover': {
                            backgroundColor: showingFavorites ? colors.greenAccent[500] : colors.primary[600],
                        },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                    }}
                >
                    {showingFavorites ? 'All Stocks' : 'Favorites'}
                </Button>
            </Box>

            <Box 
                sx={{ 
                    overflowY: 'auto', 
                    maxHeight: 'calc(45vh - 40px)', 
                    mt: 0.5,
                    pr: 1,
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: colors.primary[600],
                        borderRadius: '3px',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {isLoading && displayedStocks.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                        <Typography variant="body2" color="text.secondary">Loading stocks...</Typography>
                    </Box>
                ) : allStocks.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                        <Typography variant="body2" color="text.secondary">No stocks found</Typography>
                    </Box>
                ) : (
                    <>
                        <List dense sx={{ p: 0 }}>
                            {displayedStocks.map((stock) => (
                                <React.Fragment key={stock.id || stock.symbol}>
                                    <ListItem 
                                            onClick={() => handleStockClick(stock)}
                                        sx={{ 
                                            py: 0.5,
                                            px: 1.5,
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: colors.primary[800],
                                            },
                                            cursor: 'pointer',
                                            mb: 0.5
                                        }}
                                    >
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {stock.symbol}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                                        {formatPrice(stock.price)}
                                                    </Typography>
                                                </Box>
                                                <IconButton 
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(stock.id);
                                                    }}
                                                    sx={{ 
                                                        color: stock.favorite ? 'error.main' : 'inherit',
                                                        p: 0.5
                                                    }}
                                                >
                                                    {stock.favorite ? 
                                                        <FavoriteIcon fontSize="small" color="error" /> : 
                                                        <FavoriteBorderIcon fontSize="small" />
                                                    }
                                                </IconButton>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: colors.grey[300], display: 'block', fontSize: '0.7rem' }}>
                                                {stock.name}
                                            </Typography>
                                            {stock.industry && (
                                                <Typography variant="caption" sx={{ color: colors.grey[400], display: 'block', fontSize: '0.7rem' }}>
                                                    {stock.industry} • {stock.exchange}
                                                </Typography>
                                            )}
                                        </Box>
                                    </ListItem>
                                    <Divider variant="middle" sx={{ backgroundColor: colors.primary[800], opacity: 0.5 }} />
                                </React.Fragment>
                            ))}
                        </List>
                        
                        <Box 
                            sx={{ 
                                mt: 'auto', 
                                pt: 1, 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="caption" sx={{ color: colors.grey[400], mb: 0.5 }}>
                                {allStocks.length} results - Page {page} of {totalPages}
                            </Typography>
                            
                            {totalPages > 1 && (
                                <Pagination 
                                    count={totalPages} 
                                    page={page}
                                    onChange={handlePageChange}
                                    size="small"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: colors.grey[300],
                                            fontSize: '0.75rem',
                                            minWidth: '24px',
                                            height: '24px',
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor: colors.primary[600],
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default SearchBar;