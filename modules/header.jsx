import React, { useEffect } from 'react';
import Link from 'next/link'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Box from '@mui/material/Box';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { signOut } from 'next-auth/react';
import { useHeaderStore, useOrdersStore } from '@/components/store.js';

import AlertOrder from '@/components/AlertOrder';
import PayModel from '@/components/PayModel';

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

function SwipeableTemporaryDrawer() {

  const [ isOpenMenu, setOpenMenu, setCloseMenu ] = useHeaderStore( state => [ state.isOpenMenu, state.setOpenMenu, state.setCloseMenu ] )

  return (
    <SwipeableDrawer
      anchor={'left'}
      open={isOpenMenu}
      onClose={setCloseMenu}
      onOpen={setOpenMenu}
    >
      <List>
        
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton>
            <Link href='/list_orders'>Список заказов</Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton>
            <Link href='/map_orders'>Карта заказов</Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton>
            <Link href='/price'>Расчет</Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton>
            <Link href='/graph'>График работы</Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton>
            <Link href='/settings'>Настройки</Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={setCloseMenu}>
          <ListItemButton onClick={ () => { signOut({callbackUrl: `/auth`}) } }>
            <ListItemText primary={'Выйти'} />
          </ListItemButton>
        </ListItem>
        
      </List>
    </SwipeableDrawer>
  );
}

function ModalDelOrders() {

  const [ del_orders, hideDelOrders ] = useOrdersStore( state => [ state.del_orders, state.hideDelOrders ] )

  return (
    <Drawer
      anchor={'bottom'}
      open={ del_orders.length > 0 ? true : false }
      onClose={ hideDelOrders }
      className='modalOrderMap'
    >
      <Typography style={{ fontSize: 20, paddingTop: 10, paddingBottom: 10, color: '#000', textAlign: 'center', fontWeight: 'bold' }} component="h6">Удаленные заказы</Typography>

      <div className='modalOrderDelContent' style={{ height: 300, width: '100%', overflow: 'auto', padding: 20, paddingTop: 10 }}>
        { del_orders.map( (item, key) =>
          <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography component="span">Удаленный заказ #{item.id}</Typography>
            <Typography component="span">Адрес: {item.addr}</Typography>
          </div>
        )}
      </div>
      
      <Button className='btnGOOD' onClick={hideDelOrders}>Хорошо</Button>
    </Drawer>
  );
}

function LoadOrderSpiner() {

  const [ is_load ] = useOrdersStore( state => [ state.is_load ] )

  return (
    <Backdrop style={{ zIndex: 9999, color: '#fff' }} open={is_load}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default function Header() {

  const [ activePageRU, setOpenMenu ] = useHeaderStore( state => [ state.activePageRU, state.setOpenMenu ] )
  const [ setNotifToken ] = useOrdersStore( state => [ state.setNotifToken ] )

  useEffect( () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAK8l7m2URB6kFbBzC5iv67W34cuEzPKYc",
      authDomain: "macro-thinker-288611.firebaseapp.com",
      databaseURL: "https://macro-thinker-288611.firebaseio.com",
      projectId: "macro-thinker-288611",
      storageBucket: "macro-thinker-288611.appspot.com",
      messagingSenderId: "989415800368",
      appId: "1:989415800368:web:35373fd752ab60aa3177f5",
      measurementId: "G-YDT84TR2E2"
    };
  
    const app = initializeApp(firebaseConfig);
    
    const messaging = getMessaging();
  
    getToken(messaging, { vapidKey: 'BJmoVaG5ijS0CXc126Y47xmkjxv92stPrkQDfLql5hirvoWvAcy2N4xR1CPKVnCzUVai3ZqkzvVAjOyHGUWhogA' }).then((currentToken) => {
      if (currentToken) {
        setNotifToken(currentToken)
      }
    }).catch((err) => {
      ///
    });
  }, [] )

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={setOpenMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{activePageRU}</Typography>
        </Toolbar>
      </AppBar>

      <SwipeableTemporaryDrawer />
      <ModalDelOrders />
      <AlertOrder />
      <LoadOrderSpiner />
      <PayModel />
      
    </Box>
  )
}