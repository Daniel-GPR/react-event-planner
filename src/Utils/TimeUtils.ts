import Time from '../Classes/Time';
import {Event} from '../Types/Types'


// File to store some useful time utilities

export function isValidTimeWindow( start: Time, end: Time ): boolean{
    if(
        start.isValid() &&
        end.isValid() &&
        start.before(end)
    ){
        return true;
    }

    return false;

}


export function eventsIntersect(e1: Event, e2: Event){
    return (e1.startTime.before(e2.endTime) ) && (e1.endTime.after( e2.startTime) ) ;
}