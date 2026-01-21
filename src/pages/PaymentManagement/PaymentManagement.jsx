import { Table } from 'antd'
import { Search } from 'lucide-react'
import React from 'react'


const paymentData = [
  {
    "orderId": "#5FHM",
    "buyerName": "John Smith",
    "buyerEmail": "john@example.com",
    "sellerName": "Emma Wilson",
    "sellerEmail": "emma@example.com",
    "product": "Woman Bag",
    "date": "2024-01-15",
    "transactionId": "#1585GGL25",
    "amount": 150.00
  },
  {
    "orderId": "#5FHF",
    "buyerName": "John Smith",
    "buyerEmail": "john@example.com",
    "sellerName": "Emma Wilson",
    "sellerEmail": "emma@example.com",
    "product": "Woman t-shirt",
    "date": "2024-01-18",
    "transactionId": "#1585GGL25",
    "amount": 50.00
  },
  {
    "orderId": "#5FHR",
    "buyerName": "John Smith",
    "buyerEmail": "john@example.com",
    "sellerName": "Emma Wilson",
    "sellerEmail": "emma@example.com",
    "product": "Man t-shirt",
    "date": "2024-01-14",
    "transactionId": "#1585GGL25",
    "amount": 85.00
  },
  {
    "orderId": "#5FHW",
    "buyerName": "John Smith",
    "buyerEmail": "john@example.com",
    "sellerName": "Emma Wilson",
    "sellerEmail": "emma@example.com",
    "product": "Woman Bag",
    "date": "2024-01-20",
    "transactionId": "#1585GGL25",
    "amount": 80.00
  },
  {
    "orderId": "#5FHM",
    "buyerName": "John Smith",
    "buyerEmail": "john@example.com",
    "sellerName": "Emma Wilson",
    "sellerEmail": "emma@example.com",
    "product": "Woman t-shirt",
    "date": "2024-01-22",
    "transactionId": "#1585GGL25",
    "amount": 200.00
  }
]


const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = React.useState("")
  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Payment Management
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor all payment transection
          </p>
        </div>

      </div>

      {/* Search Bar  section */}
      <div className="flex items-center justify-center gap-5 mb-10 border p-2 rounded-md border-[#e1e2e6]">
        <div className="relative  group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={20}
              className="text-gray-400 group-focus-within:text-slate-600 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
          />
        </div>

      </div>

      {/* Payment tbale data */}
      <Table
        columns={[
          {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
          },
          {
            title: 'Buyer Name',
            dataIndex: 'buyerName',
            key: 'buyerName',
          },  
          {
            title: 'Buyer Email',
            dataIndex: 'buyerEmail',
            key: 'buyerEmail',
          },
          {
            title: 'Seller Name',
            dataIndex: 'sellerName',
            key: 'sellerName',
          },  
          {
            title: 'Seller Email',
            dataIndex: 'sellerEmail',
            key: 'sellerEmail',
          },
          {
            title: 'Product',
            dataIndex: 'product',
            key: 'product', 
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
          }
        ]}
        dataSource={paymentData}
        pagination={false}
      />
    </div>
  )
}

export default PaymentManagement