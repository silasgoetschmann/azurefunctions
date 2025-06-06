
const { app } = require('@azure/functions');

app.http('postItems', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'items',
    extraOutputs: [output.cosmosDB({
        databaseName: 'DemoDatabase',
        containerName: 'Items',
        connection: 'CosmosDB',
        createIfNotExists: true,
        partitionKey: '/id' 
    })],
    handler: async (request, context) => {
        const item = await request.json();

        // Optional: Add a unique ID if not already present
        item.id = item.id || crypto.randomUUID();

        context.extraOutputs.set(0, item); // set output to Cosmos DB
        return {
            status: 201,
            jsonBody: { message: "Item created", item }
        };
    }
});