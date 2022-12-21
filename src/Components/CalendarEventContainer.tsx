import { FunctionComponent, ReactElement } from 'react';
import { Event } from '../Types/Types';
import { CalendarEvent } from './CalendarEvent';
import { eventsIntersect } from '../Utils/TimeUtils';
import styled from 'styled-components';
import Time from '../Classes/Time';



type CalendarEventContainerProps = {
    props: {
        originTime: Time,
        items: Event[]
    }
};




export const CalendarEventContainer:FunctionComponent< CalendarEventContainerProps > = ( { props } ) => {

    const CalendarEvents: ReactElement[] = [];
    populate( props );

    const Wrapper = styled.div`
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
    `;


    return  <Wrapper style={{ position: 'relative', display: 'flex', flexDirection: 'row', width: '100%'}}>
                {CalendarEvents}
            </Wrapper>;





    // populate CalendarEvents
    function populate( props: CalendarEventContainerProps["props"] ){
        

        const { items } = props;

        interface EventData{
            event: Event;
            column: number;
            totalColumns: number;
            spanColumns: number;
        }

        const EventsData: EventData[] = [];
        

        // loop through Events supplied in props
        for(let i = 0; i < items.length; i++){
            const event = items[i];
            

            if(i === 0){ // if there are no other events, push as first
                EventsData.push(  { event, column: 1, totalColumns: 1, spanColumns: 1 } );
                continue;
            }

            // get all the events intersecting the current event
            const intersectingEvents: EventData[] = getIntersectingEvents(event);


            EventsData.push( allocateEvent( event, intersectingEvents ) );


        }



        /*
            totalColumns: the number of total columns in the row
            column: the starting column of the current event
            spanColumns: the number of columns the event spans, left to right 
        */
        EventsData.forEach( (eventData, index)=>{
            const { event, totalColumns, spanColumns, column } = eventData;
            const { originTime } = props;
            
            CalendarEvents.push( 
                <CalendarEvent key={index} event={event} props={{ originTime, totalColumns, spanColumns, column }} />
            );


        })



        function getIntersectingEvents( event: Event ): EventData[]{

            const intersectingEvents: EventData[] = [];

            /*  
                get the total columns in from the last Event in the array
                number of columns changes depending on the 'cluster'.
                events are sorted in an ascending way based on the startTime, 
                so if the event has intersections, they will all be in the same cluster as the last event in the array.
            */
            let columnsInCluster = EventsData[EventsData.length -1].totalColumns;
            EventsData.slice().reverse().every( (savedEvent) => {

                // check if this event intersects
                if( eventsIntersect( event, savedEvent.event ) ){
                    intersectingEvents.push(savedEvent);
                }

                // end fast if full row is covered, as all further events cannot be intersecting
                if( columnsInCluster !== savedEvent.totalColumns ){ 
                    return false; // break loop
                } 
                return true; // keep looping

            });

            return intersectingEvents;

        }



        // allocate the position of the event while modifying positions of previous events to avoid visual overlap
        function allocateEvent( event: Event, intersectingEvents: EventData[] ): EventData {

            // no intersections found
            if( intersectingEvents.length === 0 ){
                return { event, column: 1, totalColumns: 1, spanColumns: 1 };
            }

            // sort intersecting events by column position ascending. This is important later.
            intersectingEvents.sort( (a, b) => {
                return a.column - b.column;
            });



            // if an event is to be added in this row, this is the minimum required columns for this row
            var requiredColumnCount = intersectingEvents.length + 1; 


            //  the required columns are greater than the existing columns
            if( requiredColumnCount > intersectingEvents[0].totalColumns ){
                

                // need to increment totalColumns for each of the events in this row
                intersectingEvents.forEach((e)=>{
                    e.totalColumns = requiredColumnCount;
                })

                return { event, column: requiredColumnCount, totalColumns: requiredColumnCount, spanColumns: 1 }


            }


            // case if requiredColumnCount <= intersectingEvents[0].totalColumns )
            if(requiredColumnCount < intersectingEvents[0].totalColumns){
                requiredColumnCount = intersectingEvents[0].totalColumns
            }
            let span: number = 1;
            let column: number = 1;
            intersectingEvents.every( (ie) => {
                
                // this part of the code finds the first free section for the new event, left to right

                if( column < ie.column ){ // allocate span
                    span = ie.column - column;
                    return false; // end loop
                }


                if( column === ie.column ){ // allocate column
                    column = ie.column + ie.spanColumns ;
                    return true; // continue loop
                }

                return true; // continue loop

            })

            return { event, column: column, totalColumns: requiredColumnCount, spanColumns: span }

        

        }



    }


}


 