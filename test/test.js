var fs = require("fs");


fs.mkdir('./int2', {
    recursive: true
}, (err) => {

});


fs.writeFile('./int2/test.txt', "fsdfasdfasf", err => {
    if (err) {
        return console.error(err);
    }
})
