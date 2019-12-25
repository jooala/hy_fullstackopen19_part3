require("dotenv").config();
const mongoose = require("mongoose");
const validator = require('mongoose-unique-validator')

console.log("connecting to", url);

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength : 3,
    unique : true,
    required : true
  },
  number: {
    type: String,
    minlength : 8,
    unique : true,
    required : true
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
