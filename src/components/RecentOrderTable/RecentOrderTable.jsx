import { Table, Tag } from 'antd';

const orders = [
  {
    key: '1',
    orderId: '#15FHM',
    buyer: 'John Smith',
    seller: 'Emma Wilson',
    lockerLocation: '123 Main St, New York',
    date: '12-01-2026',
    status: 'Completed',
    price: '$120',
  },
  {
    key: '2',
    orderId: '#02NHM',
    buyer: 'John Smith',
    seller: 'Emma Wilson',
    lockerLocation: '123 Main St, New York',
    date: '16-01-2026',
    status: 'Pending',
    price: '$130',
  },
  {
    key: '3',
    orderId: '#15HM',
    buyer: 'John Smith',
    seller: 'Emma Wilson',
    lockerLocation: '123 Main St, New York',
    date: '15-01-2026',
    status: 'Completed',
    price: '$120',
  },
  {
    key: '4',
    orderId: '#63DFE',
    buyer: 'John Smith',
    seller: 'Emma Wilson',
    lockerLocation: '123 Main St, New York',
    date: '13-01-2025',
    status: 'Pending',
    price: '$70',
  },
  {
    key: '5',
    orderId: '#63DFE',
    buyer: 'John Smith',
    seller: 'Emma Wilson',
    lockerLocation: '123 Main St, New York',
    date: '14-01-2025',
    status: 'Completed',
    price: '$150',
  },
];

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: 'Buyer',
    dataIndex: 'buyer',
    key: 'buyer',
  },
  {
    title: 'Seller',
    dataIndex: 'seller',
    key: 'seller',
  },
  {
    title: 'Locker Location',
    dataIndex: 'lockerLocation',
    key: 'lockerLocation',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => {
      const [ma, da, ya] = a.date.split('-').map(Number);
      const [mb, db, yb] = b.date.split('-').map(Number);
      const dateA = new Date(ya, ma - 1, da);
      const dateB = new Date(yb, mb - 1, db);
      return dateA - dateB;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      
      return <p className={`text-center ${status === "Completed" ? "bg-[#DCFCE7] text-[#016630]" : "bg-[#DBEAFE] text-[#193CB8]"}  max-w-24 mx-auto rounded-full`}>{status}</p>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'right',
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
];

const RecentOrdersTable = () => {
  return (
    <div  >
      <h2 className='text-xl font-semibold mb-2'>Recent Orders</h2>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default RecentOrdersTable;