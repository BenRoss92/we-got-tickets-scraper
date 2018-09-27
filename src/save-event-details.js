const fs = require('fs');

function saveToFile(filePath, array, replacer = null, whiteSpace = 2) {
    const stringifiedArray = JSON.stringify(array, replacer, whiteSpace);

    fs.writeFile(filePath, stringifiedArray, (error) => {
        if (error) throw error;
        console.log(`events saved to file path '${filePath}'!`);
    });
}

module.exports.saveToFile = saveToFile;