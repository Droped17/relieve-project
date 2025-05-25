"use client"

import { gql, useQuery } from "@apollo/client"
import dayjs from "dayjs"

const PENDING_TRANSACTION = gql`
    query Transaction($status: String!) {
        findTransactionByStatus(status: $status) {
    message
    status
    data {
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

const TransactionPage = () => {

    const { data, loading, error } = useQuery(PENDING_TRANSACTION, {
        variables: {
            status: "PENDING"
        }
    })

    if (loading) return <p>Loading..</p>



    return (
        <div className="flex flex-col gap-4 max-w-[1280px] px-8">
            <p className="text-2xl font-bold">Pending Transaction</p>
            {data.findTransactionByStatus?.data ? <div className="flex flex-wrap gap-6">
                {data.findTransactionByStatus?.data?.map((transaction: any, index: number) => (
                    <div
                        key={index}
                        className="flex flex-col p-6 justify-between border border-gray-100 border-l-8 border-l-warning shadow-lg cursor-pointer hover:shadow-xl transition duration-300 min-w-[300px]"
                    >
                        {/* Loop over booking array */}
                        {transaction.booking.map((booking: any, idx: number) => (
                            <div key={idx}>
                                <p>Room No.: {booking.room?.number ?? 'N/A'}</p>
                                <p>Floor: {booking.room?.floor ?? 'N/A'}</p>
                                <p>Check In: {dayjs(Number(booking.checkIn)).format("DD/MM/YYYY")}</p>
                                <p>Check In: {dayjs(Number(booking.checkOut)).format("DD/MM/YYYY")}</p>
                            </div>
                        ))}

                        <p>Total Price: {transaction.totalPrice}</p>
                    </div>
                ))}
            </div> : <p>Not Found</p>}

        </div>
    )
}

export default TransactionPage