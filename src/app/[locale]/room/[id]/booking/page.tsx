"use client"

import Button from "@/src/components/atoms/Button"
import Divider from "@/src/components/atoms/Divider"
import HeaderText from "@/src/components/atoms/HeaderText"
import Input from "@/src/components/atoms/Input"
import Dialog from "@/src/components/molecules/Dialog"
import PageTitle from "@/src/components/molecules/PageTitle"
import { gql, useMutation, useQuery } from "@apollo/client"
import { RootState } from "@reduxjs/toolkit/query"
import clsx from "clsx"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { useSelector } from "react-redux"

interface IFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    request: string
    date: string
    acceptForm: boolean
}

const FIND_ROOMS_BY_ID = gql`
  query FindRoomBy($id: ID) {
    findRoomBy(id: $id) {
      number
      price
      image
      personPerRoom
    }
  }
`;

const CREATE_BOOKING = gql`
mutation CreateBooking($input: CreateBookingInput!){
    createBooking(input: $input) {
        _id
        checkIn
        checkOut
        room {
            _id
        }
    }
}
`


const Booking = () => {

    const [formData, setFormData] = useState<IFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        request: '',
        date: new Date().toISOString(),
        acceptForm: false,
    })
    const [stepper, setStepper] = useState<number>(1)
    const [dialog, setDialog] = useState<boolean>(false)

    const bookingFormData = useSelector((state: RootState) => state.booking);

    console.log(bookingFormData);

    const router = useRouter()
    const params = useParams()

    const [createBooking] = useMutation(CREATE_BOOKING, {
        onCompleted: (data) => {
            console.log(data);
            setDialog(true);
        },
        onError: (error) => {
            console.error(error)
        }
    })
    const { data, loading } = useQuery(FIND_ROOMS_BY_ID, {
        variables: {
            id: params.id
        }
    })

    const { personPerRoom, price, number, image } = data?.findRoomBy[0] || {};

    if (loading) return <p>Loading..</p>



    const handleNextStepper = () => {
        setStepper(prev => (prev >= 3) ? 1 : prev + 1)
    }

    const handleBackStepper = () => {
        setStepper(stepper - 1)
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const { name, type, value } = target;

        const newValue =
            type === 'checkbox'
                ? (target as HTMLInputElement).checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if (!params.id || !bookingFormData.date || !formData.firstName || !formData.lastName) {
                console.error("Missing required fields");
                return;
            }
            await createBooking({
                variables: {
                    input: {
                        roomId: params.id,
                        checkIn: bookingFormData.date,
                        nights: bookingFormData.nights,
                        personPerRoom: bookingFormData.personPerRoom,
                        guest: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone
                        }
                    }
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    // console.log(bookingFormData.date);

    const test = {
        roomId: params.id,
        checkIn: bookingFormData.date,
        nights: bookingFormData.nights,
        personPerRoom: bookingFormData.personPerRoom,
        guest: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
        }
    }

    console.log(test);

    return (
        <div className="p-6 max-w-[1024px] mx-auto">
            <PageTitle callBackUrl={`/${params.locale}/room/${params.id}`} title={'Back'} />

            <HeaderText title="Booking" className="text-2xl font-semibold text-center" />
            {/* Stepper */}
            <div className="mx-auto max-w-[1024px] p-4 flex justify-between relative">
                {/* Base gray line */}
                <div className="absolute top-1/2 inset-x-6 h-1 bg-gray-300 -z-10"></div>
                {/* Base green line */}
                <div className={`${stepper === 1 ? 'w-0' : stepper === 2 && 'w-[50%]'} absolute top-1/2 inset-x-6 h-1 bg-green-300 -z-10 transition-all duration-700`}></div>


                {/* Steps */}
                <div className={clsx('w-12 h-12 rounded-full z-10 flex justify-center items-center text-white text-lg', {
                    'bg-green-300': stepper >= 1
                })}>1</div>
                <div className={clsx('w-12 h-12 rounded-full z-10 bg-gray-300 flex justify-center items-center text-white text-lg', {
                    'bg-green-300 transition-all duration-1000': stepper >= 2
                })}>2</div>
                <div className={clsx('w-12 h-12 rounded-full z-10 bg-gray-300 flex justify-center items-center text-white text-lg', {
                    'bg-green-300 transition-all duration-1000': stepper === 3
                })}>3</div>
            </div>

            {/* Step 1 */}
            {stepper === 1 &&
                <div className="p-4 max-w-[1024px] mx-auto">
                    <HeaderText title="User Details" className="font-semibold text-xl" />
                    <form className="flex flex-col gap-3">
                        <Input type="text" label="Firstname" name="firstName" id="firstName" value={formData.firstName} onChange={handleOnChange} />
                        <Input type="text" label="Lastname" name="lastName" id="lastName" value={formData.lastName} onChange={handleOnChange} />
                        <Input type="email" label="Email" name="email" id="email" value={formData.email} onChange={handleOnChange} />
                        <Input type="text" label="Phone" name="phone" id="phone" value={formData.phone} onChange={handleOnChange} />
                        <div className="text-end">
                            <Button type="button" onClick={handleNextStepper} title="Next" className="w-[100px]" />
                        </div>
                    </form>
                </div>}
            {/* Step 2 */}
            {stepper === 2 && <div className="p-4 max-w-[1024px] mx-auto flex flex-col gap-3">
                <div className="flex justify-center">
                    <Image alt="home_img" width={600} height={600} src={image[0]} />

                </div>
                <div>
                    <HeaderText title={`Room No. ${number}`} className="font-semibold text-xl" />
                    <li>จำนวนผู้เข้าพัก : {personPerRoom}</li>
                    <li>ราคา : {price}</li>
                    <li>หมายเหตุ</li>
                    <textarea name="request" id="request" onChange={handleOnChange} value={formData.request} className="w-full border border-gray-200 rounded-md mt-2"></textarea>
                </div>
                <div className="flex justify-end gap-3">
                    <Button type="button" onClick={handleBackStepper} title="Back" className="w-[100px] bg-test" />
                    <Button type="button" onClick={handleNextStepper} title="Next" className="w-[100px]" />
                </div>
            </div>}
            {/* Step 3 */}
            {stepper === 3 && <div className="flex gap-2 p-4 max-w-[1024px] mx-auto">
                <div className="flex flex-col">
                    <HeaderText title="Payment" className="font-semibold text-lg" />
                    <li>
                        โปรดจ่ายเงินภายใน 1 ชั่วโมง
                    </li>
                    <li>
                        หากไม่ได้รับหลักฐานการโอนเงินภายในระยะเวลาที่กำหนด ทางที่พักขอสงวนสิทธิ์ปล่อยห้องอัตโนมัติ
                    </li>
                    <p className="py-2">ข้อตกลงการเข้าพัก</p>
                    <div className="h-52 overflow-auto border border-gray-200 p-2">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione voluptate tempore rerum culpa, exercitationem cum eveniet quod provident dolore repudiandae officia quas cumque quia vel facere commodi quibusdam optio facilis. Optio mollitia dolor veniam! Debitis labore, quibusdam laboriosam blanditiis consequatur amet ex, fuga vero fugit ad numquam itaque quidem! Hic atque soluta aperiam maxime harum repellat ab blanditiis odio voluptatibus? Blanditiis repudiandae, eligendi corrupti ad minima facere dolorem atque et quia tempora sit nemo recusandae distinctio aliquam, eaque maxime corporis ex. Rem totam, voluptas facilis nihil eveniet modi sapiente natus perspiciatis, reprehenderit itaque porro aliquam quis ut repellendus dignissimos excepturi, amet adipisci rerum alias et corporis accusantium! Architecto doloribus quas aperiam deserunt explicabo? Asperiores natus magni eligendi praesentium exercitationem, repellat, quos hic dolore tenetur quasi ad cum odit illo fuga vitae. Consequuntur impedit autem reprehenderit quaerat ut magnam voluptatum, quo facilis perferendis officia eos explicabo necessitatibus laborum nobis alias numquam beatae ratione tenetur nesciunt quis dolor aut? Nobis eos accusamus facere reprehenderit esse minus consectetur qui laboriosam! Numquam atque commodi autem beatae quis totam, labore perferendis. Explicabo perferendis deleniti vel necessitatibus sint dicta quaerat laboriosam quisquam reprehenderit, suscipit officia molestias quibusdam. Nihil veritatis blanditiis quisquam dignissimos laborum ipsum maxime tenetur enim, doloremque voluptatibus pariatur assumenda sit, asperiores sapiente magnam? Iusto quidem recusandae error ullam, non tenetur maiores debitis molestiae molestias fuga, harum asperiores qui, animi nesciunt voluptatem? Aliquam nulla possimus sint alias quo repellendus, temporibus vitae modi quaerat porro iste. Quos dicta neque sequi sunt facilis maxime harum optio aut architecto quaerat? Excepturi, voluptates adipisci accusamus repudiandae omnis dolore sed magnam consectetur aut, quaerat, pariatur autem expedita dolores. Suscipit quod blanditiis, fuga qui doloremque molestias aliquid deleniti incidunt non commodi, voluptatem accusamus velit vero, eligendi porro quia eos ullam vel maiores mollitia. At quae non tenetur repellendus exercitationem excepturi sapiente!</p>
                    </div>
                    <div className="flex gap-3">
                        <input type="checkbox" name="acceptForm" id="acceptForm" checked={formData.acceptForm} onChange={handleOnChange} />
                        <p>ยอมรับข้อตกลง</p>
                    </div>
                    <div className="flex justify-between text-xl my-2">
                        <p>ยอดรวม</p>
                        <strong>800</strong>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                        <Button type="button" onClick={handleBackStepper} title="Back" className="w-[100px] bg-test" />
                        <Button type="submit" onClick={handleSubmit} disable={!formData.acceptForm} title="Payment" className="w-[100px]" />
                    </div>
                </div>
            </div>}


            {dialog && (
                <Dialog className="w-full" onClose={() => setDialog(false)}>
                    <div className="p-4 text-center flex flex-col gap-4">
                        <strong className="text-xl">Please Check Your Email</strong>
                        <Divider />
                        <p>We send you QRCode in your email please check and confirm booking in 1 hour</p>
                        <div>
                            <Button type="submit" onClick={() => router.replace(`/${params.locale}/transaction`)} disable={!formData.acceptForm} title="Confirm" className="w-[100px]" />
                        </div>
                    </div>
                </Dialog>
            )}

        </div>
    )
}

export default Booking