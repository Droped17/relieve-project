"use client"

import HeaderText from "@/src/components/atoms/HeaderText"
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"

const Booking = () => {

    const [stepper, setStepper] = useState<number>(1)

    const handleNextStepper = () => {
        setStepper(prev => (prev >= 3) ? 1 : prev + 1)
    }

    const handleBackStepper = () => {
        setStepper(stepper - 1)
    }

    return (
        <div>
            <HeaderText title="Booking" className="text-2xl font-semibold text-center" />
            {/* Stepper */}
            <div className="mx-auto max-w-[1024px] p-4 flex justify-between relative">
                {/* Line */}
                <div className="absolute top-1/2 left-6 right-6 h-1 bg-gray-300 -z-10"></div>

                {/* Steps */}
                <div className={`${stepper >= 1 && 'bg-green-300'} w-12 h-12 rounded-full z-10`}></div>
                <div className={`${stepper >= 2 ? 'bg-green-300' : 'bg-gray-300'} w-12 h-12 rounded-full z-10`}></div>
                <div className={`${stepper === 3 ? 'bg-green-300' : 'bg-gray-300'} w-12 h-12 rounded-full z-10`}></div>
                {/* <div className={clsx(
                    'w-12 h-12 rounded-full z-10',
                    {
                        'bg-green-300': stepper === 1,
                    },
                )}></div> */}
            </div>

            {/* Step 1 */}
            {stepper === 1 &&
                <div className="p-4 max-w-[1024px] mx-auto">
                    <p>User Details</p>
                    <form className="flex flex-col gap-3">
                        <input type="text" name="firstName" id="firstName" className="w-full border border-gray-300 px-3 py-2 rounded" />
                        <input type="text" name="lastName" id="lastName" className="w-full border border-gray-300 px-3 py-2 rounded" />
                        <input type="email" name="email" id="email" className="w-full border border-gray-300 px-3 py-2 rounded" />
                        <input type="text" name="phone" id="phone" className="w-full border border-gray-300 px-3 py-2 rounded" />
                        <button onClick={handleNextStepper} className="p-2 bg-blue-500 text-white w-[100px]">Next</button>
                    </form>
                </div>}
            {/* Step 2 */}
            {stepper === 2 && <div className="p-4 max-w-[1024px] mx-auto flex flex-col gap-3">
                <Image alt="home_img" width={600} height={600} src={`https://images.unsplash.com/photo-1742898958003-63577fe8776e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} />
                <div>
                        <p>ห้องหมายเลข</p>
                        <li>จำนวนผู้เข้าพัก</li>
                        <li>ราคา</li>
                        <li>หมายเหตุ</li>
                        <textarea name="" id="" className="border border-gray-300 w-full"></textarea>
                    </div>
                <div className="flex gap-3">
                    <button onClick={handleBackStepper} className="cursor-pointer p-2 bg-gray-500 text-white w-[100px]">Back</button>
                    <button onClick={handleNextStepper} className="cursor-pointer p-2 bg-blue-500 text-white w-[100px]">Next</button>

                </div>
            </div>}
            {/* Step 3 */}
            {stepper === 3 && <div>

            </div>}

        </div>
    )
}

export default Booking