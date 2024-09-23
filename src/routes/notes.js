import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import express from 'express'
import { v4 as uuidv4 } from 'uuid';


const router = express.Router()

const dynamodb = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "access_key",
        secretAccessKey: "secret_access_key",
    }
})

const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

router.get('/', async (request, response) => {
    const userId = request.session.user.username
    console.log(userId, "testing user id")

    try {
        const queryParams = {
            TableName: "Notes",
            ExpressionAttributeValues: {
                ":uid": userId
            },
            KeyConditionExpression: "userId = :uid"
        }

        const queryCommand = new QueryCommand(queryParams)
        const queryResponse = await ddbDocClient.send(queryCommand)

        console.log("successfully retrieved note results by user",queryResponse.Items)
        return response.json(queryResponse.Items)
    } catch (error){
        console.error("unable to retrieve notes for current user", error)
        return response.status(500).json({message: "Unable to retrieve notes"})
    }
})

router.post('/', async (request, response) => {
    const {title, subject, content} = request.body
    const userId = request.session.user.username

    if (!title || !subject || !content){
        return response.status(400).json({message: "Missing Required Fields"})
    }

    try {
        const noteId = uuidv4();
    
        const putNoteParams ={
            TableName: "Notes",
            Item: {
                userId: userId,
                noteId: noteId,
                title: title,
                subject: subject,
                content: content,
            }
        }
    
        const putNoteCommand = new PutCommand(putNoteParams)
        const putNoteResponse = await ddbDocClient.send(putNoteCommand)
        return response.status(201).json(putNoteParams.Item)
    } catch (error){
        console.error("error creating new note", error)
        return response.status(500).json({message: "error creating new note"})
    }
    
})

router.delete('/:id', (request, response) => {
    const noteId = parseInt(request.params.id)

    const noteExists = notes.some(note => note.id === noteId)
    if (!noteExists){
        return response.status(404).json({message: "Error - Note not Found"})
    }

    const deletedNote = notes.find(note => note.id === noteId)
    notes = notes.filter(note => note.id !== noteId)

    console.log("testing deleted note", deletedNote)
    response.status(200).json(deletedNote)

})

router.put('/:id', (request, response) => {
    const noteId = parseInt(request.params.id)
    const {title, subject, content} = request.body

    const noteExists = notes.some(note => note.id === noteId)

    if (!noteExists){
        return response.status(404).json({message:"Error Finding Note"})
    }

    const updateNote = notes.find(note => note.id === noteId)
    if (title){
        updateNote.title = title
    }

    if (subject){
        updateNote.subject = subject
    }
    if (content){
        updateNote.content = content
    }

    console.log("updated note", updateNote)
    response.status(200).json(updateNote)

})

export default router;