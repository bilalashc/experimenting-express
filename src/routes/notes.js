import express from 'express'


const router = express.Router()

let notes = [
    {id: 1, title: 'Canada', subject: 'The Great White North', content: 'The quick brown fox jumped over the lazy dog'},
    {id: 2, title: 'USA', subject: 'Party in the USA', content: 'This is the greatest party in the world'}
]


router.get('/', (request, response) => {
    // console.log(notes)
    response.json(notes)
})

router.post('/', (request, response) => {
    const {title, subject, content} = request.body

    if (!title || !subject || !content){
        return response.status(400).json({message: "Missing Required Fields"})
    }

    const newNote = {
        id: notes.length + 1,
        title,
        subject,
        content
    }

    notes.push(newNote)
    console.log(newNote, "testing new note")

    response.status(201).json(newNote)

})

router.delete(':id', (request, response) => {
    
})

export default router;