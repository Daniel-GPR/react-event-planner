import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { isValidTimeWindow } from '../Utils/TimeUtils';
import Time from '../Classes/Time';
import {Event} from '../Types/Types'
import { useForm } from "react-cool-form";
import '../CSS/Modal.css'


const Background = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;


const ModalWrapper = styled.div`
    width: 800px;
    height: 500px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #fff;
    color: #000;
    display: flex;
    position: relative;
    z-index: 10;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    background: #0b7fab;
`;


const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

`;

const CloseModalButton = styled(MdClose)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    color: #fff;
`;

const ErrorMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #ce1212;

`;




interface ModalProps {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    addEvent(event: Event): void;
    range: {
        startRange: Time;
        endRange: Time;
    }

}


export const Modal:FunctionComponent< ModalProps > = ( { showModal, setShowModal, addEvent, range } ) => {

    const [errorMessage, setErrorMessage] = useState("");


    interface formInput {
        name: string;
        location: string;
        start: string; 
        end: string;
    }


    const onSubmit = (values: formInput) => {

        // clear previous error messages
        setErrorMessage("");

        const { name, location, start, end } = values;
    

        // check for invalid input
        if( !name || !location ){
            setErrorMessage("Name and Location cannot be empty");
            return;
        }

        const { startRange, endRange } = range;
        if( 
            !isValidTimeWindow(new Time(start), new Time(end)) ||
            startRange.after( new Time(start) ) ||
            endRange.before( new Time(end) )
        ){
            setErrorMessage("Invalid Dates Entered");
            return;
        }

        // no errors, time to add event
        addEvent( { startTime: new Time(start), endTime: new Time(end), name, location  } );

        setShowModal(prev => !prev);
    
    
    }

    const { form, use } = useForm({
        defaultValues: { name: "", location: "", start: "", end: "" },
        onSubmit: onSubmit
    });

    const errors = use("errors");


        // react-cool-form used
        return (
        <>
        {showModal ? (
            <Background>
            <div >
                <ModalWrapper>
                    <ModalContent>

                        <form ref={form} noValidate>
                            <div>
                                <input name="name" placeholder="Event Title" required />
                                {errors.name && <p>{errors.name}</p>}
                            </div>
                            <div>
                                <input name="location" placeholder="Location" required />
                                {errors.location && <p>{errors.location}</p>}
                            </div>
                            <div>
                                <input name="start" placeholder="Start Time" required />
                                {errors.location && <p>{errors.start}</p>}
                            </div>
                            <div>
                                <input name="end" placeholder="End Time" required />
                                {errors.location && <p>{errors.end}</p>}
                            </div>
                            <ErrorMessage hidden={ errorMessage !== "" } >{errorMessage}</ErrorMessage>

                            <input type="submit" />
                        </form>

                    </ModalContent>
                <CloseModalButton
                    onClick={() => setShowModal(prev => !prev)}
                />
                </ModalWrapper>
            </div>
            </Background>
        ) : null}
        </>
    );
};
