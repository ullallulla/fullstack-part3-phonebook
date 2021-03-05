const express = require('express')
const morgan = require('morgan')
const app = express()


require('dotenv').config()

const Dude = require('./models/dude')

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))
app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))






app.get('/api/persons', (request, response) => {
    Dude.find({}).then(dudes => {
        response.json(dudes)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Dude.findById(request.params.id)
        .then(dude => {
            if (dude) {
                response.json(dude)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.get('/info', (request, response) => {
    Dude.find({}).then(dudes => {
        const info = {
            peopleInfo: `Phonebook has info for ${dudes.length} people`,
            date: new Date()
        }


        response.send(`<p>${info.peopleInfo}</p> <p>${info.date}</p>`)

    })


})


const generateId = () => {
    return Math.floor(Math.random() * 20000)
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const dude = new Dude({
        name: body.name,
        number: body.number
    })
    console.log(body.number, typeof(body.number))
    dude.save().then(savedDude => {
        response.json(savedDude.toJSON())
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Dude.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const dude = {
        name: body.name,
        number: body.number,
    }

    Dude.findByIdAndUpdate(request.params.id, dude, { new: true })
        .then(updatedDude => {
            console.log(updatedDude)
            response.json(updatedDude)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})