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
    let lastEvaluatedTableName = null

    try {
            do {
                const command = new ListTablesCommand({
                    Limit: 1,
                    ExclusiveStartTableName: lastEvaluatedTableName
                })
                const response = await dynamodbClient.send(command)
                lastEvaluatedTableName = response.LastEvaluatedTableName
                console.log("list all table", response)
            } while (lastEvaluatedTableName)

    } catch (error){
        console.error("error listing tables", error)
    }
}

listTables();