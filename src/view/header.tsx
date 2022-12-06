import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import IonIcon from '@sentre/antd-ionicon'
import { Menu, MenuProps, Row, Col } from 'antd'

import { useAppRouter } from 'hooks/useAppRoute'

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
    <Row className="header">
      <Col span={24}>
        <Menu
          selectedKeys={[pageKey]}
          items={LIST_MENU_ITEM}
          mode="horizontal"
          onSelect={onSelect}
        />
      </Col>
    </Row>
  )
}

export default Header
