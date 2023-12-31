import { useState } from 'react';

import Meta from '@/components/meta.js';

import { useRouter } from 'next/navigation'

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useLoginStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextinput';
import Logo from '@/public/Logo.png';

import { roboto } from '@/ui/Font';

export default function AuthPage(){
  const router = useRouter();

  const [ loginErr, login ] = useLoginStore( state => [ state.loginErr, state.login ] )

  const [ myLogin, setMyLogin ] = useState('');
  const [ myPWD, setMyPWD ] = useState('');

  let host = '';

  if (typeof window !== "undefined") {
    host = window.location.origin;
  }

  async function loginFN(){
    if( myLogin.length == 0 || myPWD.length == 0 ){
      return ;
    }

    const res = await login(myLogin, myPWD);

    if( res.st === true ){
      router.push('/list_orders', { scroll: false })
    }
  }

  return (
    <Meta title='Авторизация'>
      <Grid container spacing={3} className={"auth " + roboto.variable}>
        
        <Grid item xs={12} md={4}>
          
          <Image
            alt={'Лого'}
            src={Logo}
            width={150}
            height={150}
            priority={true}
          />

          <MyTextInput label="Номер телефона" type={'text'} value={myLogin} onChange={ e => setMyLogin(e.target.value) } />
          <MyTextInput label="Пароль" type={'password'} value={myPWD} onChange={ e => setMyPWD(e.target.value) } onKeyPress={ () => loginFN() } />
          
          <span>{loginErr}</span>

          <Button variant="contained" onClick={ () => loginFN() }>Войти</Button>
          <a href='/registration'>Восстановить пароль</a>

        </Grid>
        
      </Grid>
    </Meta>
  )
}
