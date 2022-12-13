import { Redirect, Route, Switch } from 'react-router-dom'
import { net, useAppRoute } from '@sentre/senhub'

import { Col, Row } from 'antd'
import Header from './header'
import Dashboard from './dashboard'
import Airdrop from './airdrop'
import WrapNFT from './wrapNft'
import DevnetOnly from './devnetOnly'

import './index.less'

const View = () => {
  const { root, extend } = useAppRoute()
  if (net !== 'devnet') return <DevnetOnly />
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Header />
      </Col>
      <Col span={24} className="container">
        <Switch>
          <Route exact path={extend('/dashboard')} component={Dashboard} />
          <Route exact path={extend('/airdrop')} component={Airdrop} />
          <Route exact path={extend('/wrap-nft')} component={WrapNFT} />
          <Redirect from="*" to={`${root}/dashboard`} />
        </Switch>
      </Col>
    </Row>
  )
}

export default View
