import Time from '../Classes/Time';


// interface used to hold event data
export interface Event {
    startTime: Time;
    endTime: Time;
    name: string;
    location: string;
}