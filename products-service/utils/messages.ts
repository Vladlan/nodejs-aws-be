export const messages = {
    notFound: (id: string) => `Product with id: ${id} does not exists!`,
    idIsWrong: 'Id is wrong',
    internalServerError: 'Internal server error',
    successDbConnection: 'Successfully connected to database',
    successDbDisconnection: 'Disconnected from database',
    failDbConnection: (err: Error) => `Failed to connect to database. Error: ${JSON.stringify(err, null, 2)}`,
    failDbDisconnection: (err: Error) => `Failed to disconnect from database. Error: ${JSON.stringify(err, null, 2)}`,
    failToCreateTables: (err: Error) => `Failed to create tables. Error: ${JSON.stringify(err, null, 2)}`,
    failToQueryAllProduct: (err: Error) => `Failed to query all products. Error: ${JSON.stringify(err, null, 2)}`,
    failToQueryProduct: (err: Error) => `Failed to query product. Error: ${JSON.stringify(err, null, 2)}`,
};