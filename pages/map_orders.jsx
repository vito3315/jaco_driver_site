import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

const DynamicHeader = dynamic(() => import('@/modules/header.jsx'))
const DynamicHomePage = dynamic(() => import('@/modules/map.jsx'))

import { useOrdersStore, useHeaderStore } from '@/components/store.js';

export default function Map() {

  const router = useRouter();
  const session = useSession();

  const [ setActivePageRU ] = useHeaderStore( state => [ state.setActivePageRU ] )
  const [ getOrders, setToken, clearMap ] = useOrdersStore( state => [ state.getOrders, state.setToken, state.clearMap ] )

  useEffect( () => {
    setActivePageRU('Карта заказов');
    clearMap();
  }, [] )

  useEffect(() => {
    if( session.status == 'authenticated' ){
      setToken(session.data?.user?.token);
      getOrders(true);
    }

    if( session.status == 'unauthenticated' ){
      router.push('/auth', { scroll: false })
    }
  }, [session] );

  return (
    <>
      <DynamicHeader />
      <DynamicHomePage />
    </>
  )
}