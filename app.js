/**
 *  author hw83770
 */

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send("Hello world! <br>  Config utils: <h2><a href='/json2yaml'>utils<a/></h2> <br>Author kenneth ");
});

app.use(express.urlencoded());
app.post('/node_download', function (req, res) {
    var name = req.body.name;
    var text = req.body.text;
    var path = req.body.path;
    var fs = require("fs");

    if (path != undefined) {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, {
                recursive: true
            }, (err) => {
                console.error(err)
            });
        }
    }

    fs.writeFile(path + name, text, err => {
        if (err) {
            return console.error(err);
        }
    })
    res.send("ok");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.use('/css', express.static('css'));
app.use('/favicon.ico', express.static('favicon.jpeg'));
app.use('/js', express.static('js'));
app.use('/json2yaml', express.static('json-to-yaml.html'));
