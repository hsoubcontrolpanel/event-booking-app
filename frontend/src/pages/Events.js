import {  useQuery } from '@apollo/client';
import React from 'react';
import { EVENTS } from '../queries'
export default function EventsPage() {
    function EventList(){
        const { loading, error, data } = useQuery(EVENTS)
        if (loading) return <p>Loading...</p>;
        if (error) return error.message;
        return data.events.map(({ _id, title, description }) => (
            <div key={_id}>
                <p>{title} : {description}</p>
            </div>
        ))       
    }
    return (
        <EventList />
    )
}
