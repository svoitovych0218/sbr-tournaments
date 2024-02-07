import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface Props {
    window?: () => Window;
}

const drawerWidth = 240;

const defaultEnv = 'production';
export const EnvContext = createContext(defaultEnv);

export const Layout = (props: Props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [env, setEnv] = useState<string>(defaultEnv);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                <ListItem key={'Tournaments'} disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <Link to={'/tournaments'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        SBR Stats
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button key={'TeamMatches'} sx={{ color: '#fff' }} onClick={() => navigate('/tournaments')}>
                            {'Team Matches'}
                        </Button>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button key={'NewUsers'} sx={{ color: '#fff' }} onClick={() => navigate('/new-users-stats')}>
                            {'New User Stats'}
                        </Button>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button key={'UsersActivity'} sx={{ color: '#fff' }} onClick={() => navigate('/activity-stats')}>
                            {'Users Activity'}
                        </Button>
                    </Box>
                    <FormControl sx={{ marginTop: 'auto' }}>
                        <InputLabel id="demo-simple-select-label">ENV</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={env}
                            label="Env"
                            onChange={(e: any) => {
                                setEnv(e.target.value);
                            }}
                        >
                            <MenuItem value={'dev'}>Dev</MenuItem>
                            <MenuItem value={'stage'}>Playtest</MenuItem>
                            <MenuItem value={'production'}>Prod</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box component="main" sx={{ p: 3, display: 'block', width: '100%' }}>
                <Toolbar />
                <EnvContext.Provider value={env}>
                    <Outlet />
                </EnvContext.Provider>
            </Box>
        </Box>
    );
}