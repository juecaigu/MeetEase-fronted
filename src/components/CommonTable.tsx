import React, { useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Table, message, Button, Space, Dropdown, Menu, Pagination } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import type { PaginationProps } from 'antd/es/pagination'
import { EllipsisOutlined } from '@ant-design/icons'
import http from '@/api/http'

// 操作按钮接口
interface ActionButton {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: (record: unknown, index: number) => void
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  disabled?: boolean
}

// 分页参数接口
interface PaginationParams {
  pageNo: number
  pageSize: number
}

// 查询参数接口
interface QueryParams extends PaginationParams {
  [key: string]: unknown
}

// 响应数据接口
interface ApiResponse<T> {
  code: number
  data: {
    list: T[]
    total: number
    pageNo: number
    pageSize: number
  }
  message: string
}

// 分页配置接口
interface PaginationConfig {
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => string
  pageSizeOptions?: string[]
}

// 组件属性接口
interface CommonTableProps<T = unknown> {
  url: string
  onDataChange?: (data: T[], total: number) => void
  columns: ColumnsType<T>
  paginationConfig?: PaginationConfig
  queryParams?: Record<string, unknown>
  autoLoad?: boolean
  method?: 'GET' | 'POST'
  tableProps?: Partial<TableProps<T>>
  topActions?: ActionButton[]
  rowActions?: ActionButton[]
}

// 组件引用接口
export interface CommonTableRef {
  refresh: (params?: Partial<QueryParams>) => void
  reset: () => void
  getCurrentData: () => unknown[]
}

const CommonTable = forwardRef<CommonTableRef, CommonTableProps>(
  (
    {
      url,
      onDataChange,
      columns,
      paginationConfig = {},
      queryParams = {},
      autoLoad = true,
      method = 'GET',
      tableProps = {},
      topActions = [],
      rowActions = [],
    },
    ref,
  ) => {
    // 状态管理
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState<unknown[]>([])
    const [total, setTotal] = useState(0)
    const [pagination, setPagination] = useState<PaginationParams>({
      pageNo: 1,
      pageSize: 20,
    })

    // 处理列配置，自动添加省略号和title
    const processedColumns = React.useMemo(() => {
      const finalColumns: ColumnsType<unknown> = columns.map((col) => ({
        ...col,
        ellipsis: true,
        title: col.title,
        render: (value: unknown, record: unknown, index: number) => {
          if (col.render) {
            return col.render(value, record, index)
          }
          return <span title={value?.toString() || ''}>{value?.toString() || '-'}</span>
        },
      }))

      // 如果有操作列按钮，添加操作列
      if (rowActions && rowActions.length > 0) {
        const actionColumn = {
          title: '操作',
          key: 'action',
          ellipsis: false,
          fixed: 'right' as const,
          width: rowActions.length <= 3 ? rowActions.length * 80 + 20 : 120,
          render: (_: unknown, record: unknown, index: number) => {
            if (rowActions.length <= 3) {
              // 3个及以下按钮，直接显示
              return (
                <Space size="small">
                  {rowActions.map((action) => (
                    <Button
                      key={action.key}
                      type={action.type || 'link'}
                      size="small"
                      danger={action.danger}
                      disabled={action.disabled}
                      icon={action.icon}
                      onClick={() => action.onClick(record, index)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Space>
              )
            } else {
              // 超过3个按钮，显示前2个 + 更多下拉菜单
              const visibleActions = rowActions.slice(0, 2)
              const hiddenActions = rowActions.slice(2)

              const menu = (
                <Menu>
                  {hiddenActions.map((action) => (
                    <Menu.Item
                      key={action.key}
                      icon={action.icon}
                      onClick={() => action.onClick(record, index)}
                      danger={action.danger}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu>
              )

              return (
                <Space size="small">
                  {visibleActions.map((action) => (
                    <Button
                      key={action.key}
                      type={action.type || 'link'}
                      size="small"
                      danger={action.danger}
                      disabled={action.disabled}
                      icon={action.icon}
                      onClick={() => action.onClick(record, index)}
                    >
                      {action.label}
                    </Button>
                  ))}

                  <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
                    <Button type="link" size="small" icon={<EllipsisOutlined />}>
                      更多
                    </Button>
                  </Dropdown>
                </Space>
              )
            }
          },
        }

        finalColumns.push(actionColumn)
      }

      return finalColumns
    }, [columns, rowActions])

    // 加载数据
    const loadData = useCallback(
      async (params?: Partial<QueryParams>) => {
        try {
          setLoading(true)

          const requestParams = {
            ...pagination,
            ...queryParams,
            ...params,
          }

          let response: ApiResponse<unknown>

          if (method === 'POST') {
            response = await http.post(url, requestParams)
          } else {
            response = await http.get(url, { params: requestParams })
          }

          if (response.code === 200) {
            const { list, total: totalCount, pageNo, pageSize } = response.data
            setDataSource(list || [])
            setTotal(totalCount || 0)
            setPagination({ pageNo, pageSize })

            // 调用回调函数
            onDataChange?.(list || [], totalCount || 0)
          } else {
            message.error(response.message || '数据加载失败')
          }
        } catch (error) {
          console.error('加载数据失败:', error)
          message.error('数据加载失败')
        } finally {
          setLoading(false)
        }
      },
      [url, method, pagination, queryParams, onDataChange],
    )

    // 处理分页变化
    const handlePaginationChange = useCallback(
      (page: number, pageSize: number) => {
        const newPagination = { pageNo: page, pageSize }
        setPagination(newPagination)
        loadData(newPagination)
      },
      [loadData],
    )

    // 刷新方法
    const refresh = useCallback(
      (params?: Partial<QueryParams>) => {
        loadData(params)
      },
      [loadData],
    )

    // 重置方法
    const reset = useCallback(() => {
      const defaultPagination = { pageNo: 1, pageSize: 20 }
      setPagination(defaultPagination)
      loadData(defaultPagination)
    }, [loadData])

    // 获取当前数据
    const getCurrentData = useCallback(() => {
      return dataSource
    }, [dataSource])

    // 暴露方法给父组件
    useImperativeHandle(
      ref,
      () => ({
        refresh,
        reset,
        getCurrentData,
      }),
      [refresh, reset, getCurrentData],
    )

    // 自动加载数据
    useEffect(() => {
      if (autoLoad) {
        loadData()
      }
    }, [autoLoad, loadData])

    // 分页配置
    const paginationProps: PaginationProps = {
      current: pagination.pageNo,
      pageSize: pagination.pageSize,
      total,
      onChange: handlePaginationChange,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`,
      pageSizeOptions: ['10', '20', '50', '100'],
      ...paginationConfig,
    }

    return (
      <div className={'h-full flex flex-col bg-white pl-4 pr-4'}>
        {topActions && topActions.length > 0 && (
          <div className="pt-4 pb-4">
            <Space size="middle">
              {topActions.map((action) => (
                <Button
                  key={action.key}
                  type={action.type || 'default'}
                  icon={action.icon}
                  danger={action.danger}
                  disabled={action.disabled}
                  onClick={() => action.onClick({}, -1)}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </div>
        )}

        <Table
          {...tableProps}
          columns={processedColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          scroll={{ y: 'calc(100% - 55px)' }}
          rowKey={tableProps.rowKey || 'id'}
          size="middle"
          bordered
        />
        <div className="mt-4 flex justify-end">
          <Pagination {...paginationProps} />
        </div>
      </div>
    )
  },
)

CommonTable.displayName = 'CommonTable'

export default CommonTable
