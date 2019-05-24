const transformToCsv = (createCsvStringifier, headers, records) => {
    const csvStringifier = createCsvStringifier({
        header: headers,
    });
    
    return csvStringifier.stringifyRecords(records);
};

module.exports = {
    transformToCsv
};