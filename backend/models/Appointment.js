const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    phone : {
        type : String
    },
    time : {
        type : String,
        required : true
    },
    imagePath: {
      type: String
    }
}, { collection : "appointment"}
)

module.exports = mongoose.model("appointment", appointmentSchema)