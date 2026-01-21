import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tabs, Input, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const initialCategories = [
  { key: '1', sl: 1, name: 'Woman' },
  { key: '2', sl: 2, name: 'Men' },
  { key: '3', sl: 3, name: 'Kids' },
  { key: '4', sl: 4, name: 'Electronics' },
];

const locakerAddresses = [
  { key: '1', sl: 1, address: '123 Main St, Cityville' },
  { key: '2', sl: 2, address: '456 Oak Ave, Townsville' },
];

const CategoryLocker = () => {

  const [activeTab, setActiveTab] = useState("categories");
  return (
    <div className="min-h-screen bg-white p-6 md:p-5 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Category & Locker
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor all transactions and pickups
          </p>
        </div>
      </div>

      {/* Categorues and loceker address tab button */}

      <div className='border border-gray-300 rounded-md p-2 inline-block space-x-5'>
        <button
          className={`cursor-pointer p-2 rounded-md ${activeTab === 'categories' ? 'bg-[#1A435C] text-white' : 'bg-white text-black'}`}
          onClick={() => setActiveTab('categories')}
          style={{ borderRadius: '4px 0 0 4px' }}
        >
          Categories
        </button>
        <button
          className={`cursor-pointer p-2 rounded-md ${activeTab === 'locker' ? 'bg-[#1A435C] text-white' : 'bg-white text-black'}`}
          onClick={() => setActiveTab('locker')}
          style={{ borderRadius: '0 4px 4px 0', marginLeft: -1 }}
        >
          Locker Address
        </button>
      </div>

      {/* Category table data  */}
      {activeTab === 'categories' ? (
        <div className=''>
          <Table
            columns={[
              {
                title: 'SL',
                dataIndex: 'sl',
                key: 'sl',
              },
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Action',
                key: 'action',
                align: 'center',
                className: 'text-center',
                render: (_, record) => (
                  <Space size="middle">
                    <button type="primary" className="bg-[#1A435C] text-white px-2 py-1 cursor-pointer rounded-md">
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title="Are you sure delete this category?"
                      onConfirm={() => message.success('Delete successfully')}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            dataSource={initialCategories}
            pagination={false}
          />
        </div>
      ) : (
        <div>
          {/* Locker Address content */}
          <Table
            columns={[
              {
                title: 'SL',
                dataIndex: 'sl',
                key: 'sl',
              },
              {
                title: 'Locker Address',
                dataIndex: 'address',
                key: 'address',
              },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                   <Space size="middle">
                    <button type="primary" className="bg-[#1A435C] text-white px-2 py-1 cursor-pointer rounded-md">
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title="Are you sure delete this category?"
                      onConfirm={() => message.success('Delete successfully')}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            pagination={false}
            dataSource={locakerAddresses}
          />
        </div>
      )}
    </div>
  )
}

export default CategoryLocker