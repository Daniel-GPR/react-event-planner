import moment from 'moment';



// type used to manipulate and hold 'time' data. Only the time is relevent in this case, not the date.
export default class Time {

  time: moment.Moment;
  format: string = 'h:mma';


  constructor( time: string ){

    this.time = moment(time, [this.format]);
    // if(!this.isValid()){
    //   throw new Error("Invalid Time string supplied to Time constructor");
    // }

  }


  addSeconds( amount: number ): void{
    this.time.add( moment.duration(amount, 'seconds') );

  }

  addMinutes( amount: number ): void{
    this.time.add( moment.duration(amount, 'minutes') );
    
  }


  getTime(): moment.Moment{
    return this.time;
  }


  getString( format?: string ): string {
    return this.time.format( format ? format : this.format );
  }


  // AM or PM
  getIndicator(): string{
    return this.time.format( 'a' );
  }


  isValid(): boolean{
    return this.time.isValid();
  }

  isExactHour(): boolean{
    return this.getString('mm') === '00';
  }


  before( timeb: Time ): boolean{

    return this.getTime().isBefore( timeb.getTime() );

  } 


  beforeOrAt( timeb: Time ): boolean{

    return this.getTime().isSameOrBefore( timeb.getTime() );

  } 


  after( timeb: Time ): boolean{

    return this.getTime().isAfter( timeb.getTime() );

  } 


  equals( timeb: Time ): boolean{
    return this.getTime().isSame( timeb.getTime() );
  }

  

  clone(): Time {
    
    const clone: Time =  new Time (this.time.format( this.format ));
    return clone;
  }


  // returns difference in minutes absolute
  getDiff( time: Time ): number {
    return  Math.abs(this.getTime().diff(time.getTime(), 'minutes'));
  }


  getDiffReal( time: Time ): number {
    return  this.getTime().diff(time.getTime(), 'minutes');
  }




}  
