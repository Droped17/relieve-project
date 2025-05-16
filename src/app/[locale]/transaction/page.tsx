"use client"

import Button from "@/src/components/atoms/Button"
import HeaderText from "@/src/components/atoms/HeaderText"
import Input from "@/src/components/atoms/Input"
import { useState } from "react"

interface IFormData {
    bookingNumber: string
}

const TransactionPage = () => {
    const [formData, setFormData] = useState<IFormData>({
        bookingNumber: ""
    })

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="p-6 flex flex-col gap-8 max-w-[1024px] mx-auto">
            <HeaderText title="Check Transaction" className="text-2xl font-semibold text-center" />
            <form className="flex gap-2 items-end w-full">
                <Input id="bookingNumber" name="bookingNumber" label="Booking Number" type="text" onChange={handleOnChange} value={formData.bookingNumber} className="w-full rounded-lg font-semibold text-lg" />
                <Button type="submit" className="rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                </Button>
            </form>


            {/* [TODO]: Show when search booking number */}
            <div>
            <HeaderText title="Confirm Payment" className="font-bold text-lg"/>

            </div>
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