export const messages = {
    notFound: (id: string) => `Product with id: ${id} does not exists!`,
    idHasNotBeenProvided: 'Id has not been provided',
    internalServerError: 'Internal server error',
    successDbConnection: 'Successfully connected to database',
    successDbDisconnection: 'Disconnected from database',
    failDbConnection: (err: Error) => `Failed to connect to database. Error: ${err}`,
    failDbDisconnection: (err: Error) => `Failed to disconnect from database. Error: ${err}`,
    failToCreateTables: (err: Error) => `Failed to create tables. Error: ${err}`,
    failToQueryAllProduct: (err: Error) => `Failed to query all products. Error: ${err}`,
};