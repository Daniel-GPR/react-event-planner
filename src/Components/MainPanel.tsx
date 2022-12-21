import { FunctionComponent, useState } from 'react';
import CenteredText from './CenteredText';
import Time from '../Classes/Time';
import { CalendarEventContainer } from './CalendarEventContainer';
import { Event } from '../Types/Types';
import { scale } from '../Utils/UiUtil';
import {Modal} from './Modal'
import styled from 'styled-components';
import { MdAdd, MdLibraryBooks } from 'react-icons/md';
import "../CSS/MainPanel.css"




const minuteIncrements = 30; 
const finalHeight = scale( minuteIncrements ); //scaleFactor is necessary to be able to modify scaling



const AddEventButton = styled(MdAdd)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 1;
`;

const BulkAddButton = styled(MdLibraryBooks)`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 1;
`;





export const MainPanel:FunctionComponent<{ props?: MainPanelProps }> = ({ props = defaultProps }) => {

    const [Events, setEvents] = useState<Event[]>([]);


    // for testing
    const bulk = [
        {startTime: new Time('9:30am'), endTime: new Time('10:30am'), name: "event 1x", location: "somewhere"},
        {startTime: new Time('9:40am'), endTime: new Time('10:50am'), name: "event 2x", location: "somewhere"},
        {startTime: new Time('9:50am'), endTime: new Time('11:20am'), name: "event 3x", location: "somewhere"},
        {startTime: new Time('10:50am'), endTime: new Time('12:30pm'), name: "event 4x", location: "somewhere"},

    ];



    // Modal screen used to enter new Event
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal( prev => !prev);
    };




    const { startTime, endTime } = props;
    const labels = generateTimeLabels(startTime, endTime);  //get the time Labels

    
    return <>

        <AddEventButton onClick={openModal}/>
        {/* <BulkAddButton onClick={ ()=> {bulkAddCalendarEvent(bulk)} }/>  */}
        <Modal range={{ startRange: startTime, endRange: endTime }} addEvent={addCalendarEvent} showModal={showModal} setShowModal={setShowModal} />

        <div style={{ display: 'flex', margin: 20, flexDirection: 'row'}}>
            
            <div style={{ paddingRight: 6, width: 80, display: 'flex',  justifyContent: 'flex-end', alignItems: 'center', alignContent: 'center' }} >
                {labels}
            </div>
            <div style={{ border: 40, borderColor: "#ec1e1e", paddingLeft: 20, paddingRight: 20, position: 'relative', display: 'flex',  flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: "#e8e8e8", width: '100%', marginTop: finalHeight/2, marginBottom: finalHeight/2, borderRadius: 2 }}>
                <CalendarEventContainer props={{ originTime: startTime, items: Events }} />
            </div>

        </div>

    </>


    function sortEvents( events: Event[] ){
        return events.sort( (a, b) => {
            return (a.startTime).getDiffReal(b.startTime);
        });
    }


    // callback used to add an event
    function addCalendarEvent( event: Event ): void {
        const current = Events.concat( event );

        // sort out new array before updating
        setEvents( sortEvents(current) );
        
    }


    // used for testing
    function bulkAddCalendarEvent( events: Event[] ): void {
        const current = Events;
        events.forEach((event)=>{
            current.push(event);
        })

        setEvents( sortEvents(current) );
    }


}




// generates the properly aligned time labels
function generateTimeLabels( startTime: Time, endTime: Time ) {

    const time: Time = startTime.clone();

    const rows = [];
    
    let i: number = 0;
    while (true) {

        if(time.isExactHour()){
            rows.push(
                <div className="time-frame"  key={i}> 
                    <CenteredText className="primary-text" height={finalHeight} style={{ textAlign: 'right'}}>{ time.getString('h:mm') }</CenteredText>
                    <CenteredText className="secondary-text" height={finalHeight} style={{ textAlign: 'center', paddingLeft: 6 }}>{ time.getIndicator().toUpperCase() }</CenteredText>
                </div>
            );
        }
        else{
            rows.push(
                <div key={i}> 
                    <CenteredText className="secondary-text" height={finalHeight} style={{ textAlign: 'right'}}>{ time.getString('h:mm') }</CenteredText>
                </div>
            );

        }
        
        // increment by 30 minute steps
        time.addMinutes(30);
        if(time.after(endTime)){
            break; //stop if we reached the end of the range specified
        }
        i++;

    }

    return <div>{rows}</div>
}





interface MainPanelProps {
    startTime: Time;
    endTime: Time;
}


const defaultProps: MainPanelProps = {
    startTime: new Time( '9:00am' ),
    endTime: new Time( '9:00pm' )
}