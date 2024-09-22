import { DescribeTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: "access_key_id",
        secretAccessKey: "secret_access_key"
    }
})

const describeUserTable = async () =>{
    try {
        const command = new DescribeTableCommand({
            TableName: "Users"
        })
        const response = await dynamodbClient.send(command)
        console.log("Describing Users Table", response)
    } catch (error){
        console.error("Error Describing Users Table", error)
    }
}

describeUserTable();

const describeNotesTable = async () => {
    try {
        const command = new DescribeTableCommand({
            TableName: "Notes"
        })
        const response = await dynamodbClient.send(command)
        console.log("Describe Notes Table", response)
    } catch (error) {
        console.error("Error Describing Notes Table", error)
    }
}

describeNotesTable();