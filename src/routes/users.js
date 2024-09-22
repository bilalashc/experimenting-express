import express from 'express'
import bcrypt from 'bcrypt'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const router = express.Router()

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials: {
        secretAccessKey: "secret_access_key",
        accessKeyId: "access_key"
    }
})

const ddbDocClient = DynamoDBDocumentClient.from(dynamodbClient)

router.post('/register', async (request, response) => {
    const {username, password} = request.body

    if (!username || !password){
        return response.status(400).json({message: "Username and Password are required"})
    }

    try {
        const getUserParams = {
            Key: {
                username: username
            },
            TableName: "Users"
        }

        const getUserCommand = new GetCommand(getUserParams)
        const getUserResponse = await ddbDocClient.send(getUserCommand)

        if (getUserResponse.Item) {
            return response.status(409).json({message: "Username already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const putUserParams = {
            Item: {"username" : username, "password" : hashedPassword},
            TableName: "Users"
        }
        const putUserCommand = new PutCommand(putUserParams)
        await ddbDocClient.send(putUserCommand)

        return response.status(201).json({message: "New user created successfully"})

    } catch (error){
        console.error("error creating new user", error)
        return response.status(400).json({message: "Error Creating New User"})
    }
})

router.post('/login', async (request, response) => {
    const {username, password} = request.body

    try {
        const getUserParams = {
            Key: {username: username},
            TableName: "Users"
        }
        const getUserCommand = new GetCommand(getUserParams)
        const getUserResponse = await ddbDocClient.send(getUserCommand)

        if (!getUserResponse.Item || getUserResponse.Item.username !== username){
            return response.status(400).json({message: "Invalid Credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, getUserResponse.Item.password)

        if (!passwordCompare){
            return response.status(400).json({message: "Invalid Credentials"})
        }
        
        request.session.user = {username}
        return response.status(201).json({message: "User logged in successfully"})
    } catch (error){
        console.error("user unable to login, unexepcted error", error)
        return response.status(500).json({message: "Error logging in"})
    }

})

router.delete('/logout', (request, response) => {
    request.session.destroy();
    response.status(201).json({message: "User logged out successfully"})
})

export default router;