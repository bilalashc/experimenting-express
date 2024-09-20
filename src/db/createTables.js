import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000"
});

const notesTableParams = {
    TableName: "Notes",
    AttributeDefinitions: [
      {
        AttributeName: "noteId",
        AttributeType: "S",
      },
      {
        AttributeName: "userId",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "noteId",
        KeyType: "RANGE",
      },
      {
        AttributeName: "userId",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
}

const createTable = async () => {
    try {
        const command = new CreateTableCommand(notesTableParams)
        const response = await dynamodbClient.send(command)
    } catch (error){
        console.error("Error Creating New Notes Table", error)
    }
}
createTable();







