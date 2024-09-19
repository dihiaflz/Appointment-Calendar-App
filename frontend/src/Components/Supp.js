import React from "react";
import Button from "@material-ui/core/Button"
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import "./Supp.css"



const Supp = ({cancel, userToSupp, success}) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await fetch(`http://localhost:5000/delete/${userToSupp._id}`, { 
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Backend's response: ", data);
                setErrorMessage("");
                setShowError(false);
                success()
                
            } else{
                const data = await response.json();
                console.log("Backend's error message : ", data);
                setErrorMessage(data.error);
                setShowError(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error : ", error);
        }
    }

    return(
        <div className="supp">
            <div>
                {showError && (
                    <div style={{ backgroundColor: "#F57C00", padding: "2vh", color: "white", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                )}
            </div>
            <div className="container">
                <h1 className="title">Delete</h1>
                <p>Are you sure of deleting the appointment with {userToSupp.name} the {userToSupp.date} at {userToSupp.time} ?</p>
                <div className="buttons">
                    <Button variant="contained" color="primary" onClick={() => cancel()}>Cancel</Button>
                    <Button variant="outlined" color="primary" onClick={handleFormSubmit}>Delete</Button>
                </div>
            </div>
        </div>
    )
}

export default Supp;

  