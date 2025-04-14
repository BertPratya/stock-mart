

import React, { useState } from 'react';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WalletIcon from '@mui/icons-material/Wallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StarIcon from '@mui/icons-material/Star';
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from '../../theme';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Item: React.FC<{ title: string; to: string; icon: React.ReactNode; selected: string; setSelected: (value: string) => void }> = ({ title, to, icon, selected, setSelected }) => {
    return (
      <MenuItem
        active={selected === title}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        {/* <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}> */}
          <Typography>{title}</Typography>
        {/* </Link> */}
      </MenuItem>
    );
  };

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
<Box
  sx={{
    "& .pro-sidebar-inner": {
      background: `${colors.primary[900]} !important`,
    },
    "& .pro-icon-wrapper": {
      backgroundColor: "transparent !important",
    },
    "& .pro-inner-item": {
      padding: "5px 35px 5px 20px !important",
      color: `${colors.primary[100]} !important`,
      transition: "all 0.3s ease !important", 
    },
    "& .pro-inner-item:hover": {
        color: `${colors.blueAccent[200]} !important`,
        background: `${colors.blueAccent[700]} !important`, 
    },
    "& .pro-menu-item.active": {
      color: `${colors.blueAccent[200]} !important`,
      background: `${colors.blueAccent[800]} !important`, 
    },
  }}
>
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowCircleRightIcon /> : <ArrowCircleLeftIcon />}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  StockMart
                </Typography>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <AccountCircleIcon
                  sx={{
                    fontSize: "60px",
                    color: colors.grey[100],
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "6px 0 0 0" }}
                >
                  John Doe
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  user@example.com
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Market"
              to="/market"
              icon={<ShowChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Portfolio"
              to="/portfolio"
              icon={<WalletIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Transactions"
              to="/transactions"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Watchlist"
              to="/watchlist"
              icon={<StarIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;