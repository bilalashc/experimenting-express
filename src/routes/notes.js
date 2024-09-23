import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
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

router.delete('/:id', async (request, response) => {
    const noteId = request.params.id
    const userId = request.session.user.username

    try {
        const deleteNoteParams = {
            TableName: "Notes",
            Key: {
                userId: userId,
                noteId: noteId,
            }
        }

        const deleteCommand = new DeleteCommand(deleteNoteParams)
        await ddbDocClient.send(deleteCommand)
        console.log("note has been deleted", deleteNoteParams)
        return response.status(200).json({message: "note has been deleted successfully"})
    } catch (error){
        console.error("error delete note", error)
        return response.status(500).json({message: "error deleting note"})
    }
})

router.put('/:id', async (request, response) => {
    const noteId = request.params.id
    const userId = request.session.user.username
    const {title, subject, content} = request.body

    const updateExpression = []
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    if (title){
        updateExpression.push("#T = :t");
        expressionAttributeNames["#T"] = "title";
        expressionAttributeValues[":t"] = title;
    }

    if (subject){
        updateExpression.push("#ST = :st");
        expressionAttributeNames["#ST"] = "subject";
        expressionAttributeValues[":st"] = subject;
    }

    if (content){
        updateExpression.push("#C = :c")
        expressionAttributeNames["#C"] = "content";
        expressionAttributeValues[":c"] = content
    }

    if (updateExpression.length === 0){
        return response.status(500).json({message: "invalid fields provided for update"})
    }
    
    try {
        const updateNoteParams = {
            TableName: "Notes",
            Key: {
                userId: userId,
                noteId: noteId,
            },
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            UpdateExpression: "SET " + updateExpression.join(", "),
            ReturnValues: "ALL_NEW"
        }
        const updateNoteCommand = new UpdateCommand(updateNoteParams)
        const updateNoteResponse = await ddbDocClient.send(updateNoteCommand)
        console.log(updateNoteResponse, "note updated successfully")
        return response.status(200).json(updateNoteResponse)
    } catch (error){
        console.error("error updating note", error)
        return response.status(400).json({message: "error updating note"})
    }
})

export default router;