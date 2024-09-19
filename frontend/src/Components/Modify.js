import React from "react";
import Button from "@material-ui/core/Button"
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import "./Modify.css"



const Modify = ({userToModify, success, cancel}) => {
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [formData, setFormData] = useState({
        name: userToModify.name,
        description: userToModify.description,
        phone: userToModify.phone,
        image: userToModify.imagePath,
        date: userToModify.date,
        time : userToModify.time
    })

    // FOR NAME DESCRIPTION PHONE
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        })
    }

    // FOR IMAGE
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };
    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            const formattedDate = moment(date).format('YYYY-MM-DD');
            const formattedTime = moment(time).format('HH:mm');
            if(formattedDate !== 'Invalid date') { formDataToSend.delete("date"); formDataToSend.append("date", formattedDate) }
            if(formattedTime !== 'Invalid date') { formDataToSend.delete("time"); formDataToSend.append("time", formattedTime) } 
            
            const response = await fetch(`http://localhost:5000/modify/${userToModify._id}`, {
                method: 'POST',
                body: formDataToSend,
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Backend's response : ", data);
                setErrorMessage("");
                setShowError(false);
                success()
                
            } else{
                const data = await response.json();
                console.log("Backend's error message: ", data);
                setErrorMessage(data.error);
                setShowError(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    return(
        <div className="modify">
            <div>
                {showError && (
                    <div style={{ backgroundColor: "#F57C00", padding: "2vh", color: "white", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                )}
            </div>
            <div className="container">
                <h1 className="title">Modify appointment</h1>
                <form className="form" type="POST" onSubmit={handleFormSubmit}>
                    <div className="champs">
                        <div className="item">
                            <label className="labels" for = "nom">Name ( optional )</label>
                            <input className="input" onChange={handleInputChange} id="name" name="name" placeholder="Full name" ></input>
                        </div>
                        <div className="item">
                            <label className="labels" for = "adresse">Description ( optional )</label>
                            <input className="input" onChange={handleInputChange} id="description" name="description" placeholder="Description" ></input>
                        </div>
                        <div className="item">
                            <label className="labels">Date ( optional )</label>
                            <DatePicker 
                                className="input"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                dateFormat="MM/dd/yyyy"
                                minDate={moment().toDate()}
                            />
                        </div>
                        <div className="item">
                            <label className="labels">Time ( optional )</label>
                            <DatePicker 
                                
                                selected={time}
                                className="input"
                                onChange={(time) => setTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeFormat="HH:mm"
                                dateFormat="HH: mm"
                                minTime={moment().hours(7).minutes(0).toDate()}
                                maxTime={moment().hours(18).minutes(0).toDate()}
                                
                            />
                        </div>
                        <div className="item">
                            <label className="labels" for = "telephone">Phone number ( optional )</label>
                            <input onChange={handleInputChange} pattern="\d{10}" className="input" id="phone" name="phone" placeholder="phone"></input>
                        </div>
                        <div className="item">
                            <label className="labels" for = "image">Picture ( optional )</label>
                            <input onChange={handleImageChange} className="input" id="image" name="image" type="file" alt=""></input>
                        </div>
                    </div>
                    <div className="buttons">
                        <Button variant="contained" color="primary" type="submit" fullWidth>Modify</Button>
                        <Button variant="outlined" color="primary" onClick={() => cancel()} fullWidth>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modify;

  