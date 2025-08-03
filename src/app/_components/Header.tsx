'use client'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';

export default function Header() {
  // ログイン状態フラグ
  const [loginFlg, setLoginFlg] = useState<boolean>(false)
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#272727' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Street Sound Map
          </Typography>
          {!loginFlg &&
            <Button color="inherit">ログイン</Button>}

          {loginFlg &&
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}