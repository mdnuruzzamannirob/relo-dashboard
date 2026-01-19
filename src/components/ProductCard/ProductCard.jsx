
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io"


const ProductCard = ({productName , productImage , sellerName , selleImage, price , listDate , avaiablity , status}) => {
    return (
        <div className="border border-[#cccdd1] p-2 rounded-md max-w-3xl">
            <div className="flex justify-between gap-3">
                <img src={productImage} className="w-full h-47.5 object-cover rounded-md" alt="" />
                <div className="w-full  ">
                    <div className="flex justify-between p-1">
                        <div>
                            <p className="text-xl font-semibold">{productName}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <img src={selleImage}  alt="" />
                                <p>{sellerName}</p>
                            </div>
                        </div>
                        <div>

                            <p className={` ${avaiablity === "active" ? "text-[#016630] bg-[#DCFCE7]" : "text-[#F54900] bg-[#FFEDD4]"} text-[#016630] bg-[#DCFCE7] p-1 px-4 rounded-full capitalize  inline-block`}>{avaiablity}</p>
                        </div>
                    </div>
                    <p className="text-2xl font-semibold">$ {price}</p>
                    <p>Listed date: <span className="font-semibold">{listDate}</span></p>
                    <div className="flex  gap-2 mt-5">
                        {
                            status === "approved" ? <button className={`bg-[#00A63E] text-white px-5 py-1 flex items-center justify-center gap-1 rounded-md w-full cursor-pointer capitalize`}><IoMdCheckmarkCircleOutline />{status}</button> : <button className={`bg-[#FFEDD4] text-[#F54900] px-5 py-1  rounded-md w-full cursor-pointer capitalize`}>{status}</button> 
                        }
                        
                        <button className={`border-red-600  border text-red-600 px-5 py-1  rounded-md flex items-center gap-1 cursor-pointer`}><RiDeleteBin6Line />Delete</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductCard  