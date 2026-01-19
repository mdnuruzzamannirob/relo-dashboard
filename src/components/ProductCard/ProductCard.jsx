import img from "../../assets/images/product1.png"
import user from "../../assets/images/user.png"
const ProductCard = () => {
    return (
        <div className="border border-[#cccdd1] p-2 rounded-md max-w-2xl">
            <div className="flex justify-between gap-2">
                <img src={img} className="w-full" alt="" />
                <div className="w-full  ">
                    <div className="flex justify-between p-1">
                        <div>
                            <p className="text-xl font-semibold">Woman Bag</p>
                            <div className="flex items-center gap-2 mt-2">
                                <img src={user} alt="" />
                                <p>Emma Wilson</p>
                            </div>
                        </div>
                        <div>

                            <p className={`text-[#016630] bg-[#DCFCE7] p-1 px-4 rounded-full  inline-block`}>Active</p>
                        </div>
                    </div>
                    <p className="text-2xl font-semibold">$ 85.00</p>
                    <p>Listed date: <span className="font-semibold">Jan 15, 2024</span></p>
                    <div className="flex  gap-2">
                        <button className={`bg-[#00A63E] text-white px-5 py-1  rounded-md w-full`}>Approved</button>
                        <button className={`border-red-600  border text-red-600 px-5 py-1  rounded-md`}>Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductCard  