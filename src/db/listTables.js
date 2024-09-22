import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "access_key",
        secretAccessKey: "secret_access_key"
    }
})


//TODO: List Tables with Pagination
const listTables = async () => {
    try {
        const command = new ListTablesCommand({})
        const response = await dynamodbClient.send(command)
        console.log("list all table", response)
    } catch (error){
        console.error("error listing tables", error)
    }
}

listTables();