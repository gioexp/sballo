export const setTables = data => ({
    type: 'SET_TABLES',
    payload: { tables: data }
});

export const setTablesHistory = data => ({
    type: 'SET_TABLES_HISTORY',
    payload: { tablesHistory: data }
});