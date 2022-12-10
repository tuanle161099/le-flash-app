import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import { ColumnProps } from './index'

const Receivers = ({ distributorAddress }: ColumnProps) => {
  return <Button icon={<IonIcon name="document-text-outline" />} />
}

export default Receivers
