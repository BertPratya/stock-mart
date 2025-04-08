import React, { useContext } from 'react';
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { ColorModeContext,tokens } from '../../../theme';
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Topbar: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    return (
        <Box display='flex' justifyContent='space-between' p ={2}>
            <Box display={'flex'} bgcolor={colors.primary[900]} borderRadius={2}>
                <InputBase sx = {{ml:2,flex:1}} placeholder='Search'></InputBase>
                <IconButton type='button' sx = {{p:1}}>
                    <SearchIcon></SearchIcon>
                </IconButton >
            </Box>

            <Box display='flex'>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon></DarkModeOutlinedIcon> : <LightModeOutlinedIcon></LightModeOutlinedIcon>}
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon></SettingsOutlinedIcon>
                </IconButton>
                <IconButton>
                    <PersonOutlinedIcon></PersonOutlinedIcon>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;