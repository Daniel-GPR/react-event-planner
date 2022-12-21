import { FunctionComponent } from 'react';
import Time from '../Classes/Time';
import {scale} from '../Utils/UiUtil';
import { Event } from '../Types/Types';
import styled from 'styled-components';



type CalendarEventProps = {
    event: Event;
    props: {
        originTime: Time
        totalColumns: number;
        spanColumns: number;
        column: number;
    }
};






export const CalendarEvent:FunctionComponent< CalendarEventProps > = ( { props, event } ) => {

    const {  totalColumns, spanColumns, column } = props;
    const { startTime, endTime, name, location } = event;
    const originTime: Time = new Time('9:00am');


    

    const left = `calc(${ column-1 }*(100%/${totalColumns}))`;
    const width = `calc( (100%/${totalColumns}) * ${spanColumns} )`;
    const height = scale( startTime.getDiff(endTime))
    const top = scale (originTime.getDiff(startTime))


    const accentColor = '#007db7'

    const MainContainer = styled.div`
        width: ${width};
        left: ${left};
        height: ${height}px;
        top: ${top}px;
        position: absolute;
        border: 1px solid #aeaeae;
        background-color: #ffffff;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        border-radius: 3px;

    `;

    const Separator = styled.div`
        margin-right: 7px;
        width: 3px;
        background-color: ${accentColor};
    `;

    const Name = styled.div`
        font-size: 17px;
        font-weight: bold;
        color: ${accentColor};
    `;

    const Location = styled.div`
        font-weight: light;
        font-size: 13px;
    `;






    return (
        
        <MainContainer>
            <Separator/>
            <div style={{ paddingTop: 6, overflow: 'hidden', flexWrap:'wrap', textAlign: 'left', flexDirection: 'column'}}>
                <Name>
                    {name}
                </Name>
                <Location className={'secondary-text'}>
                    {location}
                </Location>
            </div>

        </MainContainer>


    )

}

