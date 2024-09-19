import React from 'react';
import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Calendar.css"


const Calendar = ({supp, modify}) => {
    const [taches, setTaches] = useState([]);
    const aujourdHui = new Date();
    const dateAujourdHuiString = aujourdHui.toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(dateAujourdHuiString);
    const [selectedDateTasks, setSelectedDateTAsks] = useState([]);

    
    useEffect(() => {
        fetchTaches();
    }, []);

    const fetchTaches = async () => {
        try {
            console.log("fetch taches")
            const response = await fetch('http://localhost:5000');
            const data = await response.json();
            if(response.ok){
                setTaches(data);
                setSelectedDateTAsks(data.filter(tache => tache.date === selectedDate))
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };  

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        console.log(arg.dateStr)
        setSelectedDateTAsks(taches.filter(tache => tache.date === arg.dateStr));
    };



    return (
        <div className="calendar">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={taches}
                dateClick={handleDateClick}
            />
            {selectedDate && selectedDateTasks.length > 0 ? (
                <div className="infos">
                <h2>Appointments for the {selectedDate}</h2>
                {selectedDateTasks.map((tache, index) => (
                    <div className="tache" key={index}>
                        {tache.imagePath && (
                        <img className="image" src={`http://localhost:5000/${tache.imagePath}`} alt={tache.name} />
                        )}
                        <p className="item-tache-heure"><b>Time : </b>{tache.time}</p>
                        <div className="item-tache-row">
                            <p className="item-tache"><b>Full Name : </b>{tache.name}</p>
                        </div>
                        <p className="item-tache"><b>Phone Number : </b>{tache.phone}</p>
                        <p className="item-tache"><b>Description : </b>{tache.description}</p>
                        <div className='buttons'>
                            <Button variant="outlined" color="primary" onClick={() => modify(tache)}>Modify</Button>
                            <Button variant="outlined" color="primary" onClick={() => supp(tache)}>Delete</Button>
                        </div>
                    </div>
                ))}
                </div>
            ) : selectedDate ? ( 
                <div className="infos">
                <h2>There is no appointments for the {selectedDate}</h2>
                </div>
            ) : (
                <div className="infos">
                <h2>There is no appointments for the {dateAujourdHuiString}</h2>
                </div>
            )}
        </div>
    );
}

export default Calendar;
