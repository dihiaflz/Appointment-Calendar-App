# Appointment-Calendar-App
A full-stack MERN appointment scheduling application with a responsive design. Users can view, add, edit, and delete appointments through a visual calendar interface using React FullCalendar. The app also allows uploading an optional image for each appointment. Fully responsive down to 300px for mobile devices.

# HOW TO USE :
1. Clone the repository to your local machine.
2. Run the command **npm install** in both folders to install all the project's dependencies
3. Create in the backend's root folder a .env file
4. The backend uses Multer to store uploaded images locally. Make sure to manually create an **uploads** folder in the root of the backend directory.
5. Create a new database in mongodb and find the link to connect your db ( sign in in mongodb website => database => connect => mongodb for vs code )
6. Fill out the **.env** file with the following information : DATABASE_URI= the link to use your db .
7. Run the code using the command **npm start** in both folders and everything will work properly 
 
GOOD LUCK !

# The code is on the master branch

# Important Note :
This project was originally built using older versions of React.
Some dependencies – such as Material-UI v4 – are not fully compatible with modern React versions (React 18+).
Because of this, you must install the frontend dependencies using:

**npm install --legacy-peer-deps**

This prevents peer-dependency conflicts and ensures the frontend installs correctly.
