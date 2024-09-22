import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "access_key",
        secretAccessKey: "secret_access_key"
    }
})

