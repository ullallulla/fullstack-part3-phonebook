const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');



const url = process.env.MONGODB_URI
console.log('connecting to', url)



mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const dudeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (number) => /\d{8}/.test(number),
            message: 'Please enter 8 digit phone number'
        }
    },
})

dudeSchema.plugin(uniqueValidator);


dudeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Dude', dudeSchema)




{/*

const Person = mongoose.model('Person', personSchema)


const person = new Person({
    name,
    number
})

if (name && number) {

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}


if (!name && !number) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
*/}




