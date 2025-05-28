"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Button from "@/src/components/atoms/Button"
import Divider from "@/src/components/atoms/Divider"
import HeaderText from "@/src/components/atoms/HeaderText"
import Dialog from "@/src/components/molecules/Dialog"
import PageTitle from "@/src/components/molecules/PageTitle"
import BookingStepper from "../../_components/BookingStepper"

interface IFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    request: string
    date: string
    acceptForm: boolean
}
// [TODO]: Call Mutation
// [TODO]: Localization


const Booking = () => {
    const [formData, setFormData] = useState<IFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        request: '',
        date: new Date().toISOString(),
        acceptForm: false,
    });
    const [dialog, setDialog] = useState<boolean>(false)

    const router = useRouter()
    const params = useParams()

    return (
        <div className="small-mobile:p-3 tablet:p-6 max-w-[1024px] mx-auto">
            {/* Title */}
            <PageTitle callBackUrl={`/${params.locale}/room/${params.id}`} title={'Back'} />
            {/* Text */}
            <HeaderText title="Booking" className="text-2xl font-semibold text-center" />
            {/* Stepper */}
            <BookingStepper formData={formData} setFormData={setFormData} setDialog={setDialog}/>
            {/* Dialog */}
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