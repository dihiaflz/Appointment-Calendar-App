require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer")
const path = require('path');
const fs = require("fs")
const app = express();
const Appointment = require("./models/Appointment");
const { error } = require("console");


// Middleware setup
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from this origin (React frontend)
}));
app.use('/uploads', express.static('uploads'));



// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to MongoDB
    } catch (err) {
        console.log(err); // Log connection error
    }
};

connectDB();

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB"); // Log once MongoDB connection is successful
});


// Start the server
const PORT = process.env.PORT || 5000; // Set port from environment or default to 5000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Configuration de Multer pour stocker les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Dossier de destination
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Renomme le fichier avec un horodatage pour éviter les doublons
    }
  });
  
const upload = multer({ storage });


// post request to add new appoitment
app.post('/', upload.single('image'), async (req, res) => {
    try {
      const { name, description, date, time, phone } = req.body;
      const imagePath = req.file ? req.file.path : null

      const existingAppointment = await Appointment.findOne({ date, time });
        
      if (existingAppointment) {
          console.log("An appointment already exists at this date and time.")
          return res.status(400).send({ error: "An appointment already exists at this date and time." });
      }
  
      const newAppointment = new Appointment({
        name,
        description,
        date,
        time,
        phone,
        imagePath
      });
  
      await newAppointment.save();
      console.log("Appointment created successfully")
      res.status(201).send({response : 'Appointment created successfully'});
    } catch (error) {
        console.log('Error creating appointment : ', error)
        res.status(500).send({error : 'Error creating appointment'});
    }
});


// get request of all the appoitments
app.get("/", async(req, res) => {
    try{
        const appointments = await Appointment.find()
        res.status(201).send(appointments)
    }catch (error) {
        console.log('Error at get appointments : ', error)
        res.status(500).send({error : 'Error at get appointments'});
    }
})


// post request to delete an appointment 
app.post("/delete/:id", async(req, res) => {
    try{
        const appointment = await Appointment.findById(req.params.id)
        if(!appointment){
            console.log('Not existing appointment')
            res.status(404).send({error : 'Not existing appointment'});
        }
        if (appointment.imagePath != null) {
            const imagePath = path.join(__dirname, '..', 'backend', appointment.imagePath); // Chemin absolu vers le fichier
            // Vérifier si le fichier existe avant de le supprimer
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier : ", err);
                } else {
                    console.log(`Fichier ${appointment.imagePath} supprimé avec succès.`);
                }
            });
        }
        await appointment.deleteOne()
        console.log("Appointment deleted successfully")
        res.status(201).send({response : "Appointment deleted successfully"})
    }catch (error) {
        console.log('Error deleting appointment : ', error)
        res.status(500).send({error : 'Error deleting appointment'});
    }
})


// post request to modify an appointment
app.post("/modify/:id", upload.single('image'),  async(req, res) => {
    try{
        const appointment = await Appointment.findById(req.params.id)
        if(!appointment){
            console.log('Not existing appointment')
            res.status(404).send({error : 'Not existing appointment'});
        }
        const { name, description, date, time, phone } = req.body;
        const imagePath = req.file ? req.file.path : appointment.imagePath
        if(req.file) {
            const imagePath = path.join(__dirname, '..', 'backend', appointment.imagePath); // Chemin absolu vers le fichier
            // Vérifier si le fichier existe avant de le supprimer
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier : ", err);
                } else {
                    console.log(`Fichier ${appointment.imagePath} supprimé avec succès.`);
                }
            });
        }

        const newVersion = {
            name : name,
            description : description,
            phone : phone,
            date : date,
            time : time,
            imagePath : req.body.image
        }
        // Extraire les champs de l'appointment existant à comparer
        const existingAppointment = {
            name: appointment.name,
            description: appointment.description,
            phone: appointment.phone,
            date: appointment.date,
            time: appointment.time,
            imagePath: appointment.imagePath
        };

        // Comparer les deux objets
        const areEqual = JSON.stringify(existingAppointment) === JSON.stringify(newVersion);
        
        if (areEqual) {
            console.log("You'he changed nothing");
            return res.status(404).send({ error: "You'he changed nothing" });
        }
        

        await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                phone,
                date,
                time,
                imagePath
            },
            { new: true }
        )
        console.log("Appointment modified successfully")
        res.status(201).send({response : "Appointment modified successfully"})
    }catch (error) {
        console.log('Error modifying appointment : ', error)
        res.status(500).send({error : 'Error modifying appointment'});
    }
})
