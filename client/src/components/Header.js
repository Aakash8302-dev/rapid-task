import React,{useState, useEffect}from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [login, setLogin] = useState(null);

  useEffect(()=> {
    if(localStorage.getItem("user")){
      setLogin(JSON.parse(localStorage.getItem("user")))
    }
  },[])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user")
    setLogin(null)
    window.location.reload();
  }



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rapid Forum
          </Typography>
          {login && login ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>{login && login.username}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : <Button variant="contained" onClick={()=> navigate('/auth')}>Login</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}