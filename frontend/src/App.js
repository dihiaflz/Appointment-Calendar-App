import React from "react";
import Button from "@material-ui/core/Button"
import { useState } from "react";
import "./App.css"
import Calendar from "./Components/Calendar";
import Form from "./Components/Form";
import Supp from "./Components/Supp"
import Modify from "./Components/Modify"



const App = () => {
    const [add, setAdd] = useState(false)
    const [userToModify, setUserToModify] = useState(null)
    const [userToSupp, setUserToSupp] = useState(null)

    return(
        <div className="App">

            {!add && !userToSupp && !userToModify && (
                <div className="main">
                    <h1>Welcome to your calendar</h1>
                    <Calendar modify={(tache) => setUserToModify(tache)} supp={(tache) => setUserToSupp(tache)} />
                    <Button variant="contained" color="primary" onClick={() => setAdd(true)}>
                        Add new appointment
                    </Button>
                </div>
            )}

            {!add && userToSupp && !userToModify && (
                <Supp userToSupp={userToSupp} success={() => {setUserToSupp(null); window.location.reload()}} cancel={() => setUserToSupp(null)}/>
            )}

            {!add && !userToSupp && userToModify && (
                <Modify userToModify={userToModify} success={() => {setUserToModify(null); window.location.reload()}} cancel={() => setUserToModify(null)}/>
            )}

            {add && !userToSupp && !userToModify && (
                <Form
                cancel={() => setAdd(false)}
                update={() => {
                    setAdd(false);
                    window.location.reload()
                }}
                />
            )}

        </div>
    )
}

export default App;

  