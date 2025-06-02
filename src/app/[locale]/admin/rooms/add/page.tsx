/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import Button from "@/src/components/atoms/Button"
import Input from "@/src/components/atoms/Input"
import { CREATE_ROOM } from "@/src/app/graphql/mutations/room.mutation"

interface IFormData {
    number: string
    detail: string[]
    price: number
    floor: number
    image: string[]
    personPerRoom: number
}

const facilities = [
    "Air Conditioner",
    "Smart TV with Netflix access",
    "Mini Refrigerator",
    " Hair Dryer",
    "Keycard access system",
    "Study desk and chair",
]


const AddRoom = () => {
    const [formData, setFormData] = useState<IFormData>({
        number: "",
        detail: [],
        price: 0,
        floor: 1,
        image: [],
        personPerRoom: 2
    });
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const router = useRouter()
    const params = useParams()

    const [createRoom] = useMutation(CREATE_ROOM, {
        onCompleted: () => {
            router.replace(`/${params.locale}/admin`)
        },
        onError: (error) => {
            console.error(error)
        }
    })


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "floor" || name === "personPerRoom"
                ? Number(value)
                : value
        }));
    };

    const handleDetailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const details = e.target.value.split(",").map(d => d.trim());
        setFormData(prev => ({
            ...prev,
            detail: details
        }));
    };

    const handleCheckboxChange = (value: string) => {
        setFormData(prev => {
            const isSelected = prev.detail.includes(value);
            return {
                ...prev,
                detail: isSelected
                    ? prev.detail.filter(item => item !== value) // Remove
                    : [...prev.detail, value] // Add
            };
        });
    };

    const handleUpload = (result: any) => {
        const uploadedUrl = result.info.secure_url;
        setImageUrls(prev => [...prev, uploadedUrl]);
        setFormData(prev => ({
            ...prev,
            image: [...prev.image, uploadedUrl]
        }))
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault()
        try {
            await createRoom({
                variables: {
                    input: {
                        number: formData.number,
                        detail: formData.detail,
                        floor: formData.floor,
                        price: formData.price,
                        personPerRoom: formData.personPerRoom,
                        image: formData.image
                    }
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-[1280px] px-8">
            <p className="text-2xl font-semibold">Add Room</p>
            <form className="flex flex-col  gap-2" onSubmit={handleSubmit}>
                <Input id="number" name="number" type="text" label="Number" onChange={handleChange} className="" />
                <Input id="price" name="price" type="number" label="Price" onChange={handleChange} className="" />
                <Input id="floor" name="floor" type="number" label="Floor" onChange={handleChange} className="" />
                <Input id="personPerRoom" name="personPerRoom" type="number" label="Person" onChange={handleChange} className="" />
                <Input id="detail" name="detail" type="text" label="Detail" onChange={handleDetailChange} className="" />
                <div className="flex gap-4">
                    <div>
                        {facilities.slice(0, 3).map((detail, index) => (
                            <label key={index} className="flex items-center gap-2 mb-1">
                                <input
                                    type="checkbox"
                                    value={detail}
                                    checked={formData.detail.includes(detail)}
                                    onChange={() => handleCheckboxChange(detail)}
                                    className="accent-blue-500"
                                />
                                {detail}
                            </label>
                        ))}
                    </div>

                    <div>
                        {facilities.slice(3).map((detail, index) => (
                            <label key={index} className="flex items-center gap-2 mb-1">
                                <input
                                    type="checkbox"
                                    value={detail}
                                    checked={formData.detail.includes(detail)}
                                    onChange={() => handleCheckboxChange(detail)}
                                    className="accent-blue-500"
                                />
                                {detail}
                            </label>
                        ))}
                    </div>
                </div>
                <p className="font-bold">Upload Image</p>
                <CldUploadWidget
                    uploadPreset="ml_default"
                    options={{ multiple: true }}
                    onSuccess={handleUpload}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Upload Image
                        </button>
                    )}
                </CldUploadWidget>

                {imageUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {imageUrls.map((url, i) => (
                            <Image key={i} alt="" src={url} width={300} height={300} />
                        ))}
                    </div>
                )}


                <div className="flex justify-end">
                    <Button type="submit" title="Add" className="py-2 px-4 rounded-lg bg-primary hover:bg-secondary" />
                </div>
            </form>
        </div>
    )
}

export default AddRoom