// BUILD YOUR SERVER HERE
const express = require('express')
const Model = require("./users/model.js")

const server = express()
server.use(express.json())

server.get('/api/users',(req,res) => {
    Model.findAll()
        .then(users => {
            console.log(users)
            res.status(200).json
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
})

server.get('api/users/:id',(req, res) => {
    const id = req.params.id
    Model.findById(id)
        .then(user => {
            console.log('this is a user -->', user)
            if(!user){
                res.status(404).json({message: `User with id ${id} does not exist in this database`})
            } else{
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
})

server.post('/api/users', (req, res) => {
    const newUser = req.body

    if(!newUser.name || !newUser.bio){
        res.status(400).json({message: "Please provide name and bio for the user"})
    } else{
        Model.create(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({message: "There was an error while saving the user to the database"})
            })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const {id} = req.params
    const changes = req.body

    try{
        if(!changes.name || !changes.bio){
            res.status(400).json({ message: "Please provide name and bio for the user"})
        } else{
            const updatedUser = await Model.update(id, changes)
            if(!updatedUser){
                res.status(404).json({message: "The user with the specified ID does not exist"})
            } else{
                res.json(updatedUser)
            }
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try{
        const deleted = await Model.delete(req.params.id)
        if(!deleted){
            res.status(404).json({message: "The user with the specified ID does not exist" })
        } else{
            res.json(deleted)
        }
    } catch(err){
        res.status(500).json({message: "The user could not be removed"})
    }
})


server.get('/', (req, res) => {
    res.json({server: "up"})
})
module.exports = server; // EXPORT YOUR SERVER instead of {}
