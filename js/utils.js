/**
 * author hw83770
 * 
 * java script utils
 * @param {*} text file content
 * @param {*} name file name
 * @param {*} path to do
 */

function download(text, name, path) {
    var a = document.createElement("a");
    var file = new Blob([text], {
        type: 'text/plain'
    });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

/**
 * to send request to nodejs backed
 * @param {*} text file content
 * @param {*} name file name
 * @param {*} path file save path
 */
function download_node(text, name, path) {
    $.post('/node_download', {
        'name': name,
        'text': text,
        'path': path
    }, res => {}, 'json');
}

/**
 * customize convert to yaml
 * @param {*} dfunc dfunc is a function about download style.
 * @param {*} path 
 */
function customConvert(dfunc, path) {

    var queueConfig = ['emcConfig', 'sslQueueConfig', 'amcQueueConfig', 'gpdwConfig', 'accrualSSLQueues', 'asyncQueuesConfig', 'autopullQueueConfig'];
    var queueObj = {};
    var commonObj = {};

    var fileNameMap = {
        "database": "database",
        "dataServiceConfig": "dataService",
        "gemfireConfig": "gemfire",
        "mailConfig": "mail",
        "positionJobConfig": "job",
        "mongoDB": "mongoDB",
        "registryCenterConfig": "registryCenter",
        "serverSslConfig": "serverSslConfig",
        "serviceURLS": "serviceUrl",
    }

    var jsonStr = $("#jsonText").val();
    if (jsonStr.trim() === "") {
        //window.alert("You must enter your YAML here.");
        document.getElementById("jsonText").focus();
        return;
    }
    try {
        jsonStr = preFormatJSON(jsonStr);
        $("#jsonText").val(jsonStr);

        var obj = JSON.parse(jsonStr);
        if (!obj) {
            window.alert("Your JSON is not valid.");
            return;
        }
        var envV = Object.values(obj)[0];

        var configs = Object.entries(envV);
        configs.forEach(config => {
            if (config[1] instanceof Object && config[0] !== 'application') {
                var temp = {}
                temp[config[0]] = config[1];
                if (queueConfig.includes(config[0])) {
                    queueObj[config[0]] = config[1];
                } else {
                    dfunc(YAML.dump(temp, 5, 4), fileNameMap[config[0]] + ".yml", path);
                }
            } else {
                commonObj[config[0]] = config[1];
            }
        });

        var comonObjwrap = {};
        comonObjwrap['common'] = commonObj;

        var queueObjwrap = {};
        queueObjwrap['queueConfig'] = queueObj;
        dfunc(YAML.dump(comonObjwrap, 5, 4), "common.yml", path);
        dfunc(YAML.dump(queueObjwrap, 5, 4), "queue.yml", path);
    } catch (e) {
        alert("Invalid JSON entered " + (e.Description ? ":" + e.Description : ""));
    }
}

function convertToYAML(depth, spaces) {
    var jsonStr = $("#jsonText").val();
    if (jsonStr.trim() === "") {
        window.alert("You must enter your JSON here.");
        document.getElementById("jsonText").focus();
        return;
    }
    try {
        jsonStr = preFormatJSON(jsonStr);
        $("#jsonText").val(jsonStr);

        var obj = JSON.parse(jsonStr);
        if (!obj) {
            window.alert("Your JSON is not valid.");
            return;
        }
        // dump(obj, depth, spaces)
        document.getElementById('yamlText').value = YAML.dump(obj, parseInt(depth), parseInt(spaces));
    } catch (e) {
        alert("Invalid JSON entered " + (e.Description ? ":" + e.Description : ""));
    }
}

function convertToJSON() {
    var str = $("#yamlText").val();
    if (str.trim() === "") {
        window.alert("You must enter your YAML here.");
        document.getElementById("jsonText").focus();
        return;
    }
    try {
        json = JSON.stringify(YAML.parse(str), null, 3);
        document.getElementById('jsonText').value = json
    } catch (e) {
        alert("Invalid YAML entered " + (e.Description ? ":" + e.Description : ""));
    }
}



function compareData() {

    var jsonStr = $("#jsonText").val();
    var yamlStr = $("#yamlText").val();

    jsonStr = preFormatJSON(jsonStr);
    $("#jsonText").val(jsonStr);

    if (jsonStr.trim() === "" || yamlStr.trim() === "") {
        alert("Please input both data of json and yaml")
        return;
    }
    var obj1 = JSON.parse(jsonStr);
    var obj2 = YAML.parse(yamlStr);

    var j1 = JSON.stringify(obj1);
    var j2 = JSON.stringify(obj2);
    if (j1 == j2) {
        alert("JSON data is same with YAML data")
    } else {
        alert("They are different, please check")
    }
}

function preFormatJSON(s) {
    if (s[0] != "{" && s[0] != "[") {
        s = "{" + s + "}";
    }
    return s;
}
