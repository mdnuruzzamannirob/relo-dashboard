import { Search } from "lucide-react";
import React, { useState } from "react";
import OrderCard from "../../components/OrderCard/OrderCard";
import user from "../../assets/images/user.png"
import user2 from "../../assets/images/user1.png"
import product from "../../assets/images/product2.png"

const Order = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const orders = [
        {
            "orderId": "#I5FHM",
            "status": "Completed",
            "product": {
                "name": "Woman Bag",
                "image": product,
                "price": 120.00
            },
            "buyer": {
                "name": "John Smith",
                "avatar": user
            },
            "seller": {
                "name": "Emma Wilson",
                "avatar": user2
            },
            "dates": {
                "orderDate": "2024-01-10",
                "completedDate": "2024-01-12"
            },
            "locker": {
                "location": "Locker A-12"
            },
            "currency": "USD"
        },
        {
            "orderId": "#I5FHM",
            "status": "Completed",
            "product": {
                "name": "Woman Bag",
                "image": product,
                "price": 120.00
            },
            "buyer": {
                "name": "John Smith",
                "avatar": user
            },
            "seller": {
                "name": "Emma Wilson",
                "avatar": user2
            },
            "dates": {
                "orderDate": "2024-01-10",
                "completedDate": "2024-01-12"
            },
            "locker": {
                "location": "Locker A-12"
            },
            "currency": "USD"
        }
    ]


    return (
        <div className="min-h-screen bg-white p-6 md:p-5 font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Order Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Monitor all transactions and pickups
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
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-2 bg-[#E8ECEF] border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
                    />
                </div>
                <div className="flex gap-5">
                    <button className="bg-[#1A435C] text-white whitespace-nowrap px-4 py-2 rounded-lg">
                        All
                    </button>
                    <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
                        Processing
                    </button>
                    <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
                        Ready
                    </button>
                    <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
                        Completed
                    </button>
                </div>

            </div>


            {/* order details section */}

            {
                orders?.map(order =>{
                    return <OrderCard key={order?.orderId} order={order} />
                })
            }





        </div>

    );
};

export default Order;
