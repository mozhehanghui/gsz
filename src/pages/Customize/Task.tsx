import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  Button,
  message,
  PaginationProps,
  Popconfirm,
  Space,
  Table,
  Tag,
  Modal,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Wrapper from 'components/ContainerLayout/ListWrapper'
import { DisplayStatus, DisplayStatusLocale, ITrainingJobs } from './types'
import { uuid } from 'utils/utils'
import { datefmtFn, durationTs } from 'utils/format'

export const renderStatus = (text: DisplayStatus) => {
  let result: React.ReactNode
  switch (text) {
    case DisplayStatus.Creating:
    case DisplayStatus.Pending:
      result = (
        <Tag icon={<ClockCircleOutlined />} color="default">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
    case DisplayStatus.Running:
    case DisplayStatus.Terminating:
      result = (
        <Tag icon={<SyncOutlined spin />} color="processing">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
    case DisplayStatus.Failed:
    case DisplayStatus.Error:
    case DisplayStatus.Terminated:
      result = (
        <Tag icon={<ClockCircleOutlined />} color="error">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
    case DisplayStatus.Succeeded:
    case DisplayStatus.Deleted:
    case DisplayStatus.Completed:
      result = (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
    case DisplayStatus.Abnormal:
      result = (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
    default:
      result = (
        <Tag icon={<ClockCircleOutlined />} color="default">
          {DisplayStatusLocale[text]}
        </Tag>
      )
      break
  }
  return result
}

const CustomizeTask: React.FC = memo(props => {
  const navigate = useNavigate()

  const log = useCallback(
    (logId: number) => () => {
      navigate(`log/${logId}`)
    },
    [navigate],
  )

  const [open, setOpen] = useState<boolean>(false)

  const columns: ColumnsType<ITrainingJobs> = [
    {
      title: '????????????',
      dataIndex: 'display_name',
      key: 'display_name',
      render: (text, record) => <a onClick={log(record.id)}>{text}</a>,
    },

    {
      title: '????????????',
      dataIndex: 'display_engine',
      key: 'display_engine',
    },

    {
      title: '????????????',
      dataIndex: 'elapsed_time',
      key: 'elapsed_time',
      render: text => durationTs(text),
    },

    {
      title: '????????????',
      dataIndex: 'create_time',
      key: 'create_time',
      render: text => datefmtFn(text, 'YYYY-MM-DD HH:mm:ss'),
    },

    {
      title: '????????????',
      dataIndex: 'flavor_desc',
      key: 'flavor_desc',
    },

    {
      title: '??????',
      dataIndex: 'display_status',
      key: 'display_status',
      render: text => renderStatus(text),
    },
    {
      title: '??????',
      width: '15%',
      key: 'action',
      render: (_: any, record: ITrainingJobs) => {
        const displayStatus = record.display_status
        return (
          <Space size="middle">
            <a key={uuid(8, 16)} onClick={log(record.id)}>
              ??????
            </a>

            <Popconfirm title="????????????????????????">
              <a key={uuid(8, 16)}>??????</a>
            </Popconfirm>

            <Popconfirm title="????????????????????????">
              <a key={uuid(8, 16)}>??????</a>
            </Popconfirm>

            {[DisplayStatus.Running, DisplayStatus.Terminating].includes(
              displayStatus,
            ) ? (
              <Popconfirm title="????????????????????????">
                <a key={uuid(8, 16)}>??????</a>
              </Popconfirm>
            ) : null}
          </Space>
        )
      },
    },
  ]

  const create = useCallback(() => {
    // navigate('create')
    setOpen(!open)
  }, [open])

  const operations = (
    <Space>
      {/* <Button>????????????</Button>
      <Button onClick={detail}>????????????</Button> */}
      <Button type="primary" onClick={create}>
        ????????????
      </Button>
      <Button icon={<SyncOutlined />}></Button>
    </Space>
  )

  const onChange: PaginationProps['onChange'] = (
    pageNumber: number,
    pageSize: number,
  ) => {
    console.log('Page: ', pageNumber, 'pagesize: ', pageSize)
  }

  return (
    <Wrapper
      pagination={{
        showQuickJumper: true,
        defaultCurrent: 1,
        total: 100,
        onChange: onChange,
      }}
    >
      <div className="tool">{operations}</div>
      <article className="w-full h-full">
        <Table
          rowKey={record => uuid(8, 16)}
          dataSource={[]}
          // dataSource={[]}
          columns={columns}
          pagination={false}
        />
      </article>

      <Modal title="Basic Modal" open={open} onOk={create} onCancel={create}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </Wrapper>
  )
})

export default CustomizeTask
