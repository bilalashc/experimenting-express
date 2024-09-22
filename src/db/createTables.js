import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
    credentials:{
        accessKeyId: "access_key_id",
        secretAccessKey: "secret_access_key"
    }
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
        AttributeName: "userId",
        KeyType: "HASH",
    },
      {
        AttributeName: "noteId",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
}

const createNotesTable = async () => {
    try {
        const command = new CreateTableCommand(notesTableParams)
        const response = await dynamodbClient.send(command)
        console.log("Notes Table Created Successfully", response)
    } catch (error){
        console.error("Error Creating New Notes Table", error)
    }
}
createNotesTable();

const usersTableParams = {
    TableName: "Users",
    AttributeDefinitions: [
      {
        AttributeName: "username",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "username",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
}

const createUsersTable = async () => {
    try {
        const command = new CreateTableCommand(usersTableParams)
        const response = await dynamodbClient.send(command)
        console.log("Users Table Created Successfully", response)
    } catch (error){
        console.error("Error Creating Users Table", error)
    }
}
createUsersTable()






