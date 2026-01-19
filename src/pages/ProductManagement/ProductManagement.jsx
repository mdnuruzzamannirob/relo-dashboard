import { Search } from 'lucide-react'
import React, { useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard';
import user from "../../assets/images/user.png"
import img1 from "../../assets/images/product2.png"
import img2 from "../../assets/images/product3.png"
import img3 from "../../assets/images/product4.png"
import img4 from "../../assets/images/product5.png"


const ProductManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Product Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Monitor and manage all listings on the platform
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
                        All Product
                    </button>
                    <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
                        Active
                    </button>
                    <button className="bg-[#E8ECEF] text-slate-700 whitespace-nowrap px-4 py-2 rounded-lg">
                        Suspended
                    </button>
                </div>

            </div>

            {/* All Product section */}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <ProductCard productName="Woman dress" productImage={img1} selleImage={user} sellerName="Emma Wilson" price="120.00" listDate="Jan 15, 2024" avaiablity="active" status="pending" />
                <ProductCard productName="Man t-shirt" productImage={img2} selleImage={user} sellerName="Emma Wilson" price="85.00" listDate="Jan 15, 2024" avaiablity="pending" status="approved" />
                <ProductCard productName="Woman t-shirt" productImage={img3} selleImage={user} sellerName="Emma Wilson" price="85.00" listDate="Jan 15, 2024" avaiablity="active" status="approved" />
                <ProductCard productName="Woman Bag" productImage={img4} selleImage={user} sellerName="Emma Wilson" price="85.00" listDate="Jan 15, 2024" avaiablity="active" status="approved" />
            </div>

            
        </div>
    )
}

export default ProductManagement