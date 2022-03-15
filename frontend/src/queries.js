import { gql } from '@apollo/client'
export const EVENTS= gql`
    query Events {
        events {
            _id
            title
            description
            price
            date
            creator {
                _id
                username
            }
        }
    }
`
export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password:$password){
            token
            userId
            username
        }
    }
`

export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!) {
        createUser(userInput: {username: $username email: $email, password:$password}){
            token
            userId
            username
        }
    }
`

export const BOOK_EVENT = gql`
    mutation BookEvent($eventId: ID!) {
        bookEvent(eventId: $eventId){
            _id
            createdAt
            updatedAt
        }
    }
`

export const CREATE_EVENT = gql`
    mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
        createEvent(eventInput: { title: $title, description: $description, price: $price, date: $date }){
            _id
            title
            description
            date
            price
        }
    }
`

