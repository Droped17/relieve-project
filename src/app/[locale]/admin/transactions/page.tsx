/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import clsx from "clsx"
import dayjs from "dayjs"
import { useMutation, useQuery } from "@apollo/client"
import Button from "@/src/components/atoms/Button"
import { CONFIRM_TRANSACTION, PENDING_TRANSACTION } from "@/src/app/graphql/queries/transaction.query"
import Loading from "../../loading"

const TransactionPage = () => {

    const { data, loading } = useQuery(PENDING_TRANSACTION, {
        variables: {
            status: "PENDING"
        }
    })

    const [confirmTransaction, { client: confirmTransactionClient, loading: confirmTransactionLoading }] = useMutation(CONFIRM_TRANSACTION, {
        onCompleted: () => {
            confirmTransactionClient.cache.evict({
                id: 'ROOT_QUERY',
                fieldName: 'findTransactionByStatus',
            })
        },
        onError: (err) => {
            console.error(err)
        }
    })

    if (loading) return <p>Loading..</p>
    if (confirmTransactionLoading) return <Loading />

    const handleConfirm = async (id: string) => {
        try {
            await confirmTransaction({
                variables: {
                    id
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-[1280px] px-8">
            <p className="text-2xl font-bold">Pending Transaction</p>
            {data.findTransactionByStatus?.data ? <div className="flex flex-wrap gap-6">
                {data.findTransactionByStatus?.data?.map((transaction: any, index: number) => (
                    <div
                        key={index}
                        className={
                            clsx(
                                `flex flex-col gap-6 p-6 justify-between border border-gray-100 border-l-8 shadow-lg cursor-pointer hover:shadow-xl transition duration-300 w-[380px]`,
                                {
                                    "border-l-warning": transaction.image === null,
                                    "border-l-blue-500": transaction.image !== null,
                                }
                            )
                        }
                    >
                        <div className="flex gap-8 items-center ">
                            {/* Loop over booking array */}
                            {transaction.booking.map((booking: any, idx: number) => (
                                <div key={idx} className="flex flex-col justify-center">
                                    <p>Room No.: {booking.room?.number ?? 'N/A'}</p>
                                    <p>Floor: {booking.room?.floor ?? 'N/A'}</p>
                                    <p>Check In: {dayjs(Number(booking.checkIn)).format("DD/MM/YYYY")}</p>
                                    <p>Check In: {dayjs(Number(booking.checkOut)).format("DD/MM/YYYY")}</p>
                                    <p>Total Price: {transaction.totalPrice}</p>
                                </div>
                            ))}

                            <div className="flex items-center justify-center border border-gray-200 w-full h-40 relative">
                                {transaction.image ? (
                                    <Image
                                        alt=""
                                        src={transaction.image}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <p>No Image</p>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="submit" title="Delete" className="p-4 bg-red-400 hover:bg-red-500" />
                            {transaction.image && <Button type="submit" title="Confirm" className="p-4 bg-primary hover:bg-secondary" onClick={() => handleConfirm(transaction._id)} />}
                        </div>

                    </div>
                ))}
            </div> : <p>Not Found</p>}

        </div>
    )
}

export default TransactionPage