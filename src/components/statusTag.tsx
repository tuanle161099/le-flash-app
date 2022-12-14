import { useMemo } from 'react'

import { Tag } from 'antd'

import { State } from 'constant'

const STATUS_COLOR: Record<State, string> = {
  Waiting: '#D4B106',
  Ready: '#03A326',
  Claimed: '#40A9FF',
  Expired: '#F9575E',
  Loading: '#F4F5F5',
}

const StatusTag = ({ state }: { state?: State }) => {
  const tagColor = useMemo(() => {
    const color = !state ? STATUS_COLOR[State.loading] : STATUS_COLOR[state]
    return color
  }, [state])

  return (
    <Tag
      style={{
        margin: 0,
        borderRadius: 4,
        border: `solid 1px ${tagColor}`,
        textTransform: 'capitalize',
        background: 'transparent',
        color: tagColor,
      }}
    >
      {!state ? State.loading : state}
    </Tag>
  )
}

export default StatusTag
