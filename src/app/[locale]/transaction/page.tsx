"use client"

import { FormEvent, useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import clsx from "clsx"
import Button from "@/src/components/atoms/Button"
import HeaderText from "@/src/components/atoms/HeaderText"
import Input from "@/src/components/atoms/Input"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useParams } from "next/navigation"
import TabButton from "@/src/components/atoms/TabButton"
import dayjs from 'dayjs'


// [TODO]: Refactor Transaction Page
// [TODO]: Call Mutation
// [TODO]: Localization

interface IFormData {
    bookingNumber: string
}

const FIND_TRANSACTION_BY = gql`
    query FindTransactionBy($id: ID) {
        findTransactionBy(id: $id) {
            _id
            status
            totalPrice
            booking {
                _id
                checkIn
                checkOut
                nights
            }
        }
    }

`

const UPLOAD_IMAGE = gql`
  mutation UploadImage($imageUrl: String!, $transactionId: ID!) {
    uploadImage(imageUrl: $imageUrl, transactionId: $transactionId)
  }
`;

const TransactionPage = () => {
    const [formData, setFormData] = useState<IFormData>({
        bookingNumber: ""
    })
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [findTransactionBy, { data, loading, error }] = useLazyQuery(FIND_TRANSACTION_BY, {
        onCompleted: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const booking = data?.findTransactionBy?.[0]?.booking?.[0];

    const [uploadImage] = useMutation(UPLOAD_IMAGE);


    const param = useParams()
    const tabs = [
        { name: 'Home', path: `/${param.locale}/homepage` },
        { name: 'Transaction', path: `/${param.locale}/transaction` },
    ]

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        try {
            console.log(formData);
            findTransactionBy({
                variables: {
                    id: formData.bookingNumber
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpload = async (result: any) => {
        if (result?.event !== "success") {
            console.warn("Upload not completed yet:", result.event);
            return;
        }
        const secureUrl = result?.info?.secure_url;
        if (!secureUrl) {
            console.error("Upload succeeded but secure_url missing.");
            return;
        }

        console.log("Image uploaded successfully:", secureUrl);
        setImageUrl(secureUrl);
        const results = await uploadImage({ variables: { imageUrl: secureUrl, transactionId: data.findTransactionBy[0]._id } });
        console.log(`UPLOAD RESULT => `, results);
    };

    if (loading) return <p>Loading..</p>

    return (
        <div className="mx-auto mb-10 max-w-[1280px] px-8 flex flex-col gap-4">
            {/* Tab Button */}
            <TabButton tabs={tabs} />
            <HeaderText title="Check Transaction" className="text-2xl font-semibold text-center" />
            <div className="flex flex-col gap-1">
            <form className="flex gap-2 items-end w-full" onSubmit={handleSubmit}>
                <Input id="bookingNumber" name="bookingNumber" label="Transaction ID" type="text" onChange={handleOnChange} value={formData.bookingNumber} className={`w-full rounded-lg text-lg ${error && 'border-red-500'}`} />
                <Button type="submit" className="rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                </Button>
            </form>
            {error && <p className="text-error text-xs">{error.message}</p>}
            </div>


            {/* [TODO]: Show when search booking number */}
            {data?.findTransactionBy && <div>

                {booking ? <div>
                    <HeaderText title="Confirm Payment" className="font-bold text-lg" />
                    <div className={
                        clsx('border-l-8', {
                            'border-l-error': data.findTransactionBy[0]?.status === "NOT_PAID",
                            'border-l-primary': data.findTransactionBy[0]?.status === "PAID",
                            'border-l-warning': data.findTransactionBy[0]?.status === "PENDING",
                        })
                    }>
                        <div className="p-4 shadow-lg flex flex-col gap-1">
                            <p>Total Price: {data.findTransactionBy[0]?.totalPrice}</p>
                            <p>วันที่เข้าพัก : {booking?.checkIn ? dayjs(Number(booking.checkIn)).format("DD-MM-YYYY") : "N/A"}</p>
                            <p>จำนวนคืน : {booking?.nights ?? "N/A"}</p>
                            <p>สถานะการจอง :
                                <strong className={
                                    clsx('', {
                                        'text-error': data.findTransactionBy[0]?.status === "NOT_PAID",
                                        'text-primary': data.findTransactionBy[0]?.status === "PAID",
                                        'text-warning': data.findTransactionBy[0]?.status === "PENDING",
                                    })
                                }>
                                    {data.findTransactionBy[0]?.status}
                                </strong>
                            </p>
                            {data.findTransactionBy[0]?.status !== "PAID" && <div className="w-[200px]">
                                <CldUploadWidget
                                    uploadPreset="ml_default"
                                    onSuccess={handleUpload}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Upload Image
                                        </button>
                                    )}
                                </CldUploadWidget>

                                {imageUrl && (
                                    <div className="mt-4">
                                        <Image alt="" src={imageUrl} width={500} height={500} className="" />
                                    </div>
                                )}
                                <p className="font-thin text-xs">* file size less than 1 mb </p>
                            </div>}
                        </div>

                    </div>
                </div> : <p className="text-center text-3xl">Not Found</p>}
            </div>}

        </div>
    )
}

export default TransactionPage