/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Button from "@/src/components/atoms/Button"
import { gql, useMutation, useQuery } from "@apollo/client"
import clsx from "clsx"
import dayjs from "dayjs"
import Image from "next/image"
import Loading from "../../loading"

const PENDING_TRANSACTION = gql`
    query Transaction($status: String!) {
        findTransactionByStatus(status: $status) {
    message
    status
    data {
        _id
        image
        status
        totalPrice
        booking {
          checkIn
          checkOut
          room {
            floor
            number
          }
        }
    }
        }       
    }
`

const CONFIRM_TRANSACTION = gql`
    mutation ConfirmTransaction($id: ID) {
        confirmTransaction(id: $id)
    }
`

const TransactionPage = () => {

    const { data, loading } = useQuery(PENDING_TRANSACTION, {
        variables: {
            status: "PENDING"
        }
    })

    const [confirmTransaction, { client: confirmTransactionClient, loading: confirmTransactionLoading }] = useMutation(CONFIRM_TRANSACTION, {
        onCompleted: (data) => {
            console.log(data);
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

    console.log(data);

    const handleConfirm = async (id: string) => {
        try {
            console.log(id);
            console.log('Submit Button');
            await confirmTransaction({
                variables: {
                    id: data?.findTransactionByStatus?.data[0]._id
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