import { gql } from 'graphql-tag';

export const typeDefs = gql`
directive @auth(requires: Role = ADMIN) on FIELD_DEFINITION

enum Role {
  USER
  ADMIN
}

enum ERoomStatus {
  EMPTY
  FULL    
  NULL_VALUE
}

enum EStatus {
  SUCCESS
  ERROR
}
  
enum ETransactionStatus {
  PENDING
  PAID
  NOT_PAID 
}

enum EBookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

type Guest {
  firstName: String
  lastName: String
  email: String
  phone: String
}

input GuestInput {
  firstName: String!
  lastName: String!
  email: String
  phone: String
}

input CreateBookingInput {
  roomId: ID!
  checkIn: String!
  nights: Int!
  personPerRoom: Int!
  request: String
  guest: GuestInput
}

input CreateRoomInput {
  number: String!
  detail: [String!]! 
  price: Float!
  floor: Int!
  personPerRoom: Int!
  image: [String!]!
}

input CreateUserInput {
  firstName: String!
  lastName: String!
  email: String! 
  password: String!
  phone: String!
}

input FindRoomByInput {
  id: ID
  floor: Int
  status: ERoomStatus
  date: String
  nights: Int
  numberOfPeople: Int
}

input FindRoomByStatusInput {
  id: ID
  status: ERoomStatus
}

input sendContactEmailInput {
  to: String!, 
  subject: String!
  message: String
  username: String
  actionUrl: String
}


type CreateUserResponse {
  status: EStatus!
  message: String!
  data: [User!]
}

type CreateBookingResponse {
  bookingId: ID!
}

type TransactionResponse {
  status: EStatus!
  message: String!
  data: Transaction
}

type TransactionsResponse {
  status: EStatus!
  message: String!
  data: [Transaction!]
}

type EmailResponse {
  success: Boolean!
  message: String!
}

type CheckedInData {
  totalCheckIn: Int!
  pendingCheckIn: Int!
}
  
type CheckedInResponse {
  status: EStatus!
  message: String!
  data: CheckedInData!
}

type TotalUserData {
  totalUsers: Int!
  totalRooms: Int!
  totalIncome: Int!
}

type TotalCustomerResponse {
  status: EStatus!
  message: String!
  data: TotalUserData!
}

type IncomePerMonthData {
  month: String!
  totalIncome: Int!
}

type IncomePerMonthResponse {
  status: EStatus!
  message: String!
  data: [IncomePerMonthData!]!  
}

type DeleteTransactionResponse {
  status: EStatus!
  message: String!
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  phone: String!  
  role: String!
}

type Room {
  _id: ID!
  number: String!
  detail: [String!]!
  price: Float!
  floor: Int!
  image: [String!]!
  personPerRoom: Int!
  status: ERoomStatus!
  availabilityStatus: String
  isBooked: Boolean
  createdAt: String!
  updatedAt: String!
}

type Booking {
  _id: ID!
  status: EBookingStatus
  createdAt: String!
  updatedAt: String!
  transaction: [Transaction!]!
  checkIn: String!
  checkOut: String!
  nights: Int!
  personPerRoom: Int!
  guest: Guest! 
  request: String
  user: User!
  room: Room!
}

type Transaction {
  _id: ID
  totalPrice: Int
  request: String
  image: String
  status: ETransactionStatus
  checkIn: String!
  checkOut: String!
  checkedInAt: String
  checkedOutAt: String
  createdAt: String!
  updatedAt: String!
  user: [User!]
  booking: [Booking!]
  room: Room!
}

type RoomStats {
  date: String
  emptyRoomsCount: Int
  checkInRoomsCount: Int
}

type Query {
  myProfile: User @auth(requires: ADMIN)
  findTransactionByStatus(status: String!): TransactionsResponse! @auth(requires: ADMIN)
  userData: String @auth(requires: ADMIN)
  adminData: String @auth(requires: ADMIN)
  roomStatByDate(date: String!): RoomStats! @auth(requires: ADMIN)
  transaction: [Transaction!]!
  rooms(
    date: String
    nights: Int
    numberOfPeople: Int
  ): [Room!]!
  findRoomBy(input: FindRoomByInput!): [Room!]!
  findRoomByStatus(input: FindRoomByStatusInput!): [Room!]!
  countEmptyRooms: Int
  isCheckedIn(date: String!): CheckedInResponse!
  totalCustomer: TotalCustomerResponse!
  incomePerMonth: IncomePerMonthResponse!
  findTransactionBy(id: ID): TransactionResponse!
  booking: [Booking!]!
  allRooms(date: String!, nights: Int!, personPerRoom: Int!, floor: Int): [Room!]!
  availableRoom(date: String!, nights: Int!, personPerRoom: Int!, floor: Int): Int!
}

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createRoom(input: CreateRoomInput!): Room!
    createBooking(input: CreateBookingInput!): Booking!
    createTransaction(totalPrice: Int!): Transaction!
    sendContactEmail(input: sendContactEmailInput!): EmailResponse!
    uploadImage(imageUrl: String!, transactionId: ID!): Boolean!
    confirmTransaction(id: ID): Boolean!
    deleteTransaction(id: ID): DeleteTransactionResponse!
  }
 
`;
