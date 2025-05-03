import HeaderText from "@/src/components/atoms/HeaderText"

const TransactionPage = () => {
    return (
        <div className="max-w-[1024px] mx-auto flex flex-col gap-4">
            <HeaderText title="Check Transaction" className="text-2xl font-semibold text-center"/>
            <p>หมายเลขการจอง</p>
            <input type="text" className="p-2 border border-gray-200 w-full"/>


            {/* [TODO]: Show when search booking number */}
            <p>ยีนยันการโอนเงิน</p>
            <div className="border border-gray-200">
            <input type="file" name="" id="" />
            </div>

            <p>สถานะการจอง</p>
            <div className="border border-gray-200 p-2">
                <p>ชื่อผู้เข้าพัก</p>
                <p>วันที่เข้าพัก</p>
                <p>จำนวนคืน</p>
                <p>ราคาห้อง</p>
                <p>สถานะการจอง</p>
            </div>
        </div>
    )
}  

export default TransactionPage