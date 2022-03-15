import { useMutation, useQuery } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { EVENTS, BOOK_EVENT } from '../queries'
import EventItem from '../components/EventItem'
import SimpleModal from '../components/SimpleModal'
import AuthContext from '../context/auth-context'
import Error from '../components/Error'
export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [alert, setAlert] = useState("")
    const value = useContext(AuthContext)
    function EventList(){
        const { loading, error, data } = useQuery(EVENTS)
        if (loading) return <p>Loading...</p>
        if (error){
            setAlert(error.message)
            return ;
        } 

        const showDetailHandler = eventId => {
            const clickedEvent = data.events.find(event => event._id === eventId)
            setSelectedEvent(clickedEvent)
        }
        return ( 
            <div className='container-fluid'>
                <div className='row justify-content-center'>
                    {data.events.map(event => (
                        <EventItem
                            key={event._id}
                            {...event}
                            onDetail= {showDetailHandler}
                        />
                    ))} 
                </div>
            </div>
        )   
    }

    const [bookEventHandler] = useMutation(BOOK_EVENT, {
        onError: (error) => {
            setSelectedEvent(null)
            setAlert(error.message)
        },
        onCompleted: () => {
            setSelectedEvent(null)
            setAlert('تم حجز المناسبة بنجاح')
        }
    })

    return (
        <div>
            <Error error={alert} />
            {value.token && (
                <div className='events-control pt-2 text-center pb-3'>
                    <h2>شارك مناسباتك الخاصة!</h2>
                    <button className='btn'>
                        إنشاء مناسبة
                    </button>
                </div>
            )}
            <div>
                <h2 className='mb-3'>المناسبات من حولك!</h2>
                <EventList />
            </div>
            {selectedEvent && (
                <SimpleModal
                title= 'حجز مناسبة'
                onCancel= { () => { 
                    setSelectedEvent(null) 
                    setAlert("")
                } }
                onConfirm= { () => { bookEventHandler({variables: { eventId: selectedEvent._id } })} }
                confirmText={value.token ? 'احجز' : <NavLink to='/login'>سجل دخول لتحجز</NavLink>}
                isDisabled= {selectedEvent.creator._id === value.userId ? true : false }
                >
                    <h4 className='mb-4'>{selectedEvent.title}</h4>
                    <h4 className='mb-4'>
                        ${selectedEvent.price} -{' '}
                        {selectedEvent.date.split('.')[0].replace(/-/g, "/")}
                    </h4>
                    <p>{selectedEvent.description}</p>
                </SimpleModal>
            )}
        </div>
    )
}
