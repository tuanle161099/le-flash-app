import { Select, Space } from 'antd'

const FilterTrans = () => {
  return (
    <Space size={16}>
      <Select
        defaultValue="all"
        style={{ width: 145 }}
        options={[
          {
            value: 'all',
            label: 'All NFTs',
          },
        ]}
      />
      <Select
        defaultValue="all"
        style={{ width: 145 }}
        options={[
          {
            value: 'all',
            label: 'All Status',
          },
        ]}
      />
    </Space>
  )
}

export default FilterTrans
