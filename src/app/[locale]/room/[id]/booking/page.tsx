"use client"

import Button from "@/src/components/atoms/Button"
import Divider from "@/src/components/atoms/Divider"
import HeaderText from "@/src/components/atoms/HeaderText"
import Input from "@/src/components/atoms/Input"
import Dialog from "@/src/components/molecules/Dialog"
import PageTitle from "@/src/components/molecules/PageTitle"
import { RootState } from "@/src/store/store"
import { gql, useMutation, useQuery } from "@apollo/client"

import clsx from "clsx"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { BookingSchema } from "./bookingSchema"
import Loading from "../../../loading"

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
        request
        room {
            _id
        }
    }
}
`

// [TODO]: Refactor Booking by Id Page
// [TODO]: Create Stepper Component
// [TODO]: Call Mutation
// [TODO]: Localization
// [TODO]: Test Booking Logic


const Booking = () => {
    const session = useSession()

    const [formData, setFormData] = useState<IFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        request: '',
        date: new Date().toISOString(),
        acceptForm: false,
    });
    const [stepper, setStepper] = useState<number>(1)
    const [dialog, setDialog] = useState<boolean>(false)
    const [error, setError] = useState<Record<string, string[]>>({});

    const bookingFormData = useSelector((state: RootState) => state.booking);

    console.log(formData);

    const router = useRouter()
    const params = useParams()
    const schema = BookingSchema()

    const isGuest = !session?.data?.user;


    const [createBooking, {loading: creating}] = useMutation(CREATE_BOOKING, {
        onCompleted: (data) => {
            console.log(data);
            setDialog(true);
        },
        onError: (error) => {
            console.error(error)
        },
    })
    const { data, loading } = useQuery(FIND_ROOMS_BY_ID, {
        variables: {
            id: params.id
        }
    })

    const { personPerRoom, price, number, image } = data?.findRoomBy[0] || {};

    useEffect(() => {
        if (session?.data?.user) {
            setFormData((prev) => ({
                ...prev,
                firstName: session.data.user?.firstName || '',
                lastName: session.data.user?.lastName || '',
                email: session.data.user?.email || '',
                phone: session.data.user?.phone || '',
            }));
        }
    }, [session?.data?.user]);

    if (loading) return <Loading />
    if (creating) return <Loading />

    const handleNextStepper = () => {
        try {
            if (stepper === 1) {
                console.log('STEP 1');
                const validatedFormData = schema.safeParse(formData)
                if (validatedFormData.success) {
                    // SUCCESS
                    setStepper(prev => (prev >= 3) ? 1 : prev + 1)
                } else {
                    // ERROR
                    console.log(validatedFormData.error.format());
                    setError(validatedFormData.error.flatten().fieldErrors)
                }
            } else {
                setStepper(prev => (prev >= 3) ? 1 : prev + 1)
            }
        } catch (error) {
            console.error(error)
        }

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
                        request: formData.request,
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

    return (
        <div className="small-mobile:p-3 tablet:p-6 max-w-[1024px] mx-auto">
            <PageTitle callBackUrl={`/${params.locale}/room/${params.id}`} title={'Back'} />

            <HeaderText title="Booking" className="text-2xl font-semibold text-center" />
            {/* Stepper */}
            <div className="mx-auto max-w-[1024px] py-4 flex justify-between relative">
                {/* Base gray line */}
                <div className="absolute top-1/2 inset-x-6 h-1 bg-gray-300 -z-10"></div>
                {/* Base green line */}
                <div className={`${stepper === 1 ? 'w-0' : stepper === 2 && 'w-[50%]'} absolute top-1/2 inset-x-6 h-1 bg-primary -z-10 transition-all duration-700`}></div>


                {/* Steps */}
                <div className={clsx('w-12 h-12 rounded-full z-10 flex justify-center items-center text-white text-lg', {
                    'bg-primary': stepper >= 1
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
                </div>
                <div className={clsx('w-12 h-12 rounded-full z-10 bg-gray-300 flex justify-center items-center text-white text-lg', {
                    'bg-primary transition-all duration-1000': stepper >= 2
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M80-200v-240q0-27 11-49t29-39v-112q0-50 35-85t85-35h160q23 0 43 8.5t37 23.5q17-15 37-23.5t43-8.5h160q50 0 85 35t35 85v112q18 17 29 39t11 49v240h-80v-80H160v80H80Zm440-360h240v-80q0-17-11.5-28.5T720-680H560q-17 0-28.5 11.5T520-640v80Zm-320 0h240v-80q0-17-11.5-28.5T400-680H240q-17 0-28.5 11.5T200-640v80Zm-40 200h640v-80q0-17-11.5-28.5T760-480H200q-17 0-28.5 11.5T160-440v80Zm640 0H160h640Z"/></svg>
                </div>
                <div className={clsx('w-12 h-12 rounded-full z-10 bg-gray-300 flex justify-center items-center text-white text-lg', {
                    'bg-primary transition-all duration-1000': stepper === 3
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-80q-33 0-56.5-23.5T120-160v-480q0-33 23.5-56.5T200-720h80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720h80q33 0 56.5 23.5T840-640v480q0 33-23.5 56.5T760-80H200Zm0-80h560v-480H200v480Zm280-240q83 0 141.5-58.5T680-600h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85h-80q0 83 58.5 141.5T480-400ZM360-720h240q0-50-35-85t-85-35q-50 0-85 35t-35 85ZM200-160v-480 480Z"/></svg>
                </div>
            </div>

            {/* Step 1 */}
            {stepper === 1 &&
                <>
                    {isGuest ? <div className="py-4 max-w-[1024px] mx-auto">
                        <HeaderText title="User Details" className="font-semibold text-xl mb-2" />
                        <form className="flex flex-col gap-3">
                            <Input type="text" label="Firstname" name="firstName" id="firstName" value={formData.firstName} onChange={handleOnChange} error={error.firstName} />
                            <Input type="text" label="Lastname" name="lastName" id="lastName" value={formData.lastName} onChange={handleOnChange} error={error.lastName} />
                            <Input type="email" label="Email" name="email" id="email" value={formData.email} onChange={handleOnChange} error={error.email} />
                            <Input type="text" label="Phone" name="phone" id="phone" value={formData.phone} onChange={handleOnChange} error={error.phone} />
                            <div className="text-end">
                                <Button type="button" onClick={handleNextStepper} title="Next" className="w-[100px] bg-primary hover:bg-secondary" />
                            </div>
                        </form>
                    </div> :
                        <div className="max-w-[1024px] mx-auto">
                            <HeaderText title="User Details" className="font-semibold text-xl mb-2" />
                            <form className="flex flex-col gap-3">
                                <Input type="text" label="Firstname" name="firstName" id="firstName" readOnly={true} value={session.data?.user?.firstName} onChange={handleOnChange} />
                                <Input type="text" label="Lastname" name="lastName" id="lastName" readOnly={true} value={session.data?.user?.lastName} onChange={handleOnChange} />
                                <Input type="email" label="Email" name="email" id="email" readOnly={true} value={session.data?.user?.email} onChange={handleOnChange} />
                                <Input type="text" label="Phone" name="phone" id="phone" readOnly={true} value={session.data?.user.phone} onChange={handleOnChange} />
                                <div className="text-end">
                                    <Button type="button" onClick={handleNextStepper} title="Next" className="w-[100px] bg-primary hover:bg-secondary " />
                                </div>
                            </form>
                        </div>
                    }
                </>
            }
            {/* Step 2 */}
            {stepper === 2 && <div className="max-w-[1024px] py-4 mx-auto flex flex-col gap-3">
                <div className="flex justify-center">
                    <Image alt="home_img" width={600} height={600} src={image[0]} />

                </div>
                <div>
                    <HeaderText title={`Room No. ${number}`} className="font-semibold text-xl" />
                    <li>จำนวนผู้เข้าพักต่อห้อง : {personPerRoom} คน</li>
                    <li>ราคาต่อคืน : {price} บาท</li>
                    <li>จำนวนวันเข้าพัก : {bookingFormData.nights} คืน</li>
                    <li>หมายเหตุ</li>
                    <textarea name="request" id="request" onChange={handleOnChange} value={formData.request} className="w-full min-h-20 border border-gray-200 focus:border-green-800 focus:outline-none transition rounded-md mt-2 p-2"></textarea>
                </div>
                <div className="flex justify-end gap-3">
                    <Button type="button" onClick={handleBackStepper} title="Back" className="w-[100px]  bg-gray-200 hover:bg-gray-300" />
                    <Button type="button" onClick={handleNextStepper} title="Next" className="w-[100px] bg-primary hover:bg-secondary" />
                </div>
            </div>}
            {/* Step 3 */}
            {stepper === 3 && <div className="flex gap-2 max-w-[1024px] mx-auto">
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
                        <strong>{price * bookingFormData.nights} <span>&#3647;</span></strong>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                        <Button type="button" onClick={handleBackStepper} title="Back" className="w-[100px] bg-gray-200 hover:bg-gray-300" />
                        <Button type="submit" onClick={handleSubmit} disable={!formData.acceptForm} title="Payment" className="w-[100px] bg-primary hover:bg-secondary" />
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
                            <Button type="submit" onClick={() => router.replace(`/${params.locale}/transaction`)} disable={!formData.acceptForm} title="Confirm" className="w-[100px] bg-primary hover:bg-secondary" />
                        </div>
                    </div>
                </Dialog>
            )}

        </div>
    )
}

export default Booking