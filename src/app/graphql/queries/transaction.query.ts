import { gql } from "@apollo/client";

export const PENDING_TRANSACTION = gql`
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

export const FIND_TRANSACTION_BY = gql`
    query FindTransactionBy($id: ID) {
        findTransactionBy(id: $id) {
            status
            message
            data {
                _id
                status
                totalPrice
                booking {
                    _id
                    checkIn
                    checkOut
                    nights
                }
                image
            }
        }
    }

`

export const CONFIRM_TRANSACTION = gql`
    mutation ConfirmTransaction($id: ID) {
        confirmTransaction(id: $id)
    }
`

export const IS_CHECKED_IN = gql`
    query isCheckedIn($date: String!) {
        isCheckedIn(date: $date) {
            status
            message
            data {
                pendingCheckIn
                totalCheckIn
            }
        }
    }
`

export const INCOME = gql`
query IncomePerMonth {
  incomePerMonth {
    status
    message
    data {
      month
      totalIncome
    }
  }
}
`
export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($id: ID) {
        deleteTransaction(id: $id) {
           message
           status 
        }
    }
`