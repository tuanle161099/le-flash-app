import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import IonIcon from '@sentre/antd-ionicon'
import { Menu, MenuProps, Row, Col, Avatar } from 'antd'

import { useAppRouter } from 'hooks/useAppRoute'

import logo from 'static/images/logo.png'

const LIST_MENU_ITEM = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: <IonIcon name="images-outline" />,
  },
  {
    label: 'Airdrop',
    key: 'airdrop',
    icon: <IonIcon name="airplane-outline" />,
  },
  {
    label: 'Wrap NFT',
    key: 'wrap-nft',
    icon: <IonIcon name="cube-outline" />,
  },
]

const Header = () => {
  const [pageKey, setPageKey] = useState('dashboard')
  const { pathname } = useLocation()
  const { appRoute, pushHistory } = useAppRouter()

  const fetchPageKey = useCallback(() => {
    const key = pathname.replace(`${appRoute}/`, '')
    const indexOf = key.indexOf('/')
    if (indexOf === -1) return setPageKey(key)
    return setPageKey(key.slice(0, indexOf))
  }, [appRoute, pathname])

  const onSelect: MenuProps['onClick'] = async (e) => {
    return pushHistory('/' + e.key)
  }

  useEffect(() => {
    fetchPageKey()
  }, [fetchPageKey])

  return (
    <Row className="header" align="middle">
      <Col flex="auto">
        <Menu
          selectedKeys={[pageKey]}
          items={LIST_MENU_ITEM}
          mode="horizontal"
          onSelect={onSelect}
        />
      </Col>
      <Col>
        <Avatar shape="square" src={logo} size={32} />
      </Col>
    </Row>
  )
}

export default Header
