"use client"

import HeaderText from "@/src/components/atoms/HeaderText"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const Booking = () => {

    const [stepper, setStepper] = useState<number>(1)

    const router = useRouter()
     const params = useParams()

    const handleNextStepper = () => {
        setStepper(prev => (prev >= 3) ? 1 : prev + 1)
    }

    const handleBackStepper = () => {
        setStepper(stepper - 1)
    }

    const handlePayment = () => {
        router.replace(`/${params.locale}/homepage`)
    }

    return (
        <div>
                        <div className="flex gap-4">
                <Link href={`/${params.locale}/homepage`} className="cursor-pointer px-2">{`<`}</Link>
                {/* [TODO]: change this to real room number */}
                <HeaderText title={`Room ${params.id}`} className="font-semibold text-xl" />
            </div>
            <HeaderText title="Booking" className="text-2xl font-semibold text-center" />
            {/* Stepper */}
            <div className="mx-auto max-w-[1024px] p-4 flex justify-between relative">
                {/* Base gray line */}
                <div className="absolute top-1/2 inset-x-6 h-1 bg-gray-300 -z-10"></div>
                {/* Base green line */}
                <div className={`${stepper === 1 ? 'w-0' : stepper === 2 && 'w-[50%]'} absolute top-1/2 inset-x-6 h-1 bg-green-300 -z-10 transition-all duration-700`}></div>


                {/* Steps */}
                <div className={`${stepper >= 1 && 'bg-green-300'} w-12 h-12 rounded-full z-10`}></div>
                <div className={`${stepper >= 2 ? 'bg-green-300 transition-all duration-1000' : 'bg-gray-300'} w-12 h-12 rounded-full z-10`}></div>
                <div className={`${stepper === 3 ? 'bg-green-300 transition-all duration-1000' : 'bg-gray-300'} w-12 h-12 rounded-full z-10`}></div>
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
            {stepper === 3 && <div className="flex gap-2 p-4 max-w-[1024px] mx-auto">
                <div className="flex flex-col">
                    <p>Payment</p>
                    <li>
                        โปรดจ่ายเงินภายใน 1 ชั่วโมง
                    </li>
                    <li>
                        หากไม่ได้รับหลักฐานการโอนเงินภายในระยะเวลาที่กำหนด ทางที่พักขอสงวนสิทธิ์ปล่อยห้องอัตโนมัติ
                    </li>
                    <div className="h-52 overflow-auto border border-gray-200 p-2">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione voluptate tempore rerum culpa, exercitationem cum eveniet quod provident dolore repudiandae officia quas cumque quia vel facere commodi quibusdam optio facilis. Optio mollitia dolor veniam! Debitis labore, quibusdam laboriosam blanditiis consequatur amet ex, fuga vero fugit ad numquam itaque quidem! Hic atque soluta aperiam maxime harum repellat ab blanditiis odio voluptatibus? Blanditiis repudiandae, eligendi corrupti ad minima facere dolorem atque et quia tempora sit nemo recusandae distinctio aliquam, eaque maxime corporis ex. Rem totam, voluptas facilis nihil eveniet modi sapiente natus perspiciatis, reprehenderit itaque porro aliquam quis ut repellendus dignissimos excepturi, amet adipisci rerum alias et corporis accusantium! Architecto doloribus quas aperiam deserunt explicabo? Asperiores natus magni eligendi praesentium exercitationem, repellat, quos hic dolore tenetur quasi ad cum odit illo fuga vitae. Consequuntur impedit autem reprehenderit quaerat ut magnam voluptatum, quo facilis perferendis officia eos explicabo necessitatibus laborum nobis alias numquam beatae ratione tenetur nesciunt quis dolor aut? Nobis eos accusamus facere reprehenderit esse minus consectetur qui laboriosam! Numquam atque commodi autem beatae quis totam, labore perferendis. Explicabo perferendis deleniti vel necessitatibus sint dicta quaerat laboriosam quisquam reprehenderit, suscipit officia molestias quibusdam. Nihil veritatis blanditiis quisquam dignissimos laborum ipsum maxime tenetur enim, doloremque voluptatibus pariatur assumenda sit, asperiores sapiente magnam? Iusto quidem recusandae error ullam, non tenetur maiores debitis molestiae molestias fuga, harum asperiores qui, animi nesciunt voluptatem? Aliquam nulla possimus sint alias quo repellendus, temporibus vitae modi quaerat porro iste. Quos dicta neque sequi sunt facilis maxime harum optio aut architecto quaerat? Excepturi, voluptates adipisci accusamus repudiandae omnis dolore sed magnam consectetur aut, quaerat, pariatur autem expedita dolores. Suscipit quod blanditiis, fuga qui doloremque molestias aliquid deleniti incidunt non commodi, voluptatem accusamus velit vero, eligendi porro quia eos ullam vel maiores mollitia. At quae non tenetur repellendus exercitationem excepturi sapiente!</p>
                    </div>
                    <div className="flex gap-3">
                    <input type="checkbox" name="" id=""/>
                    <p>ยอมรับข้อตกลง</p>
                    </div>
                    <div className="flex justify-between text-xl my-2">
                        <p>ยอดรวม</p>
                        <strong>800</strong>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                        <button onClick={handleBackStepper} className="cursor-pointer p-2 bg-gray-500 text-white w-[100px]">Back</button>
                        <button onClick={handlePayment} className="cursor-pointer p-2 bg-blue-500 text-white w-[100px]">Payment</button>
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default Booking