const transformToCsv = (createCsvStringifier, headers, eventDetails) => {
    const csvStringifier = createCsvStringifier({
        header: headers,
    });
    
    return csvStringifier.stringifyRecords([eventDetails]);
};

module.exports = {
    transformToCsv
};