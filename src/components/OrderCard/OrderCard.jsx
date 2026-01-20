
const OrderCard = ({order}) => {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4 mb-5">
        
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={order?.product?.image}
              alt="Product"
              className="w-32 h-16 rounded-lg object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{order?.product?.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                  Completed
                </span>
              </div>
              <p className="text-sm text-gray-500">Order ID: {order?.orderId}</p>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-900">
            $120.00
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Buyer */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Buyer</p>
            <div className="flex items-center gap-2">
              <img
                src={order?.buyer?.avatar}
                alt="Buyer"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm font-medium text-gray-800">
                John Smith
              </p>
            </div>
          </div>

          {/* Seller */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Seller</p>
            <div className="flex items-center gap-2">
              <img
                src={order?.seller?.avatar}
                alt="Seller"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm font-medium text-gray-800">
                Emma Wilson
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-xs text-gray-400">Order Date</p>
            <p className="font-medium text-gray-800">Jan 10, 2024</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Locker Location</p>
            <p className="font-medium text-gray-800">Locker A-12</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Completed Date</p>
            <p className="font-medium text-gray-800">Jan 12, 2024</p>
          </div>
        </div>

      </div>
  )
}

export default OrderCard