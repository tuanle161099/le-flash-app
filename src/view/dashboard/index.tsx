import { Button, Row } from 'antd'
import { AppState } from 'model'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  console.log(distributors)
  return (
    <Row>
      <Button type="primary">Primary</Button>
      <Button ghost type="ghost">
        Gh
      </Button>
    </Row>
  )
}

export default Dashboard
