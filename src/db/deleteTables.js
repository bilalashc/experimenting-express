import { DeleteTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodbClient = new DynamoDBClient({
    region: 'local',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: "access_key_id",
        secretAccessKey: "secret_accees_key"
    }
});

const deleteUsersTable = async () => {
    try {
        const command = new DeleteTableCommand({
            TableName: "Users"
        })
        const response = await dynamodbClient.send(command)
        console.log("deleted users table", response)
    } catch (error){
        console.error("error deleting users table", error)
    }
}

deleteUsersTable();

const deleteNotesTable = async () => {
    try {
        const command = new DeleteTableCommand({
            TableName: "Notes"
        })
        const response = await dynamodbClient.send(command)
        console.log("deleted notes table", response)
    } catch (error){
        console.error("error deleting notes table", error)
    }
}

deleteNotesTable();