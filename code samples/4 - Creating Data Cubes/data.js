/*global require, alert*/
/*
 * 
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var config = {
    host: window.location.hostname,
    prefix: "/",
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik", "http://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js"], function(qlik) {
    qlik.setOnError(function(error) {
        alert(error.message);
    });

    //callbacks -- inserted here --
    //open apps -- inserted here --
    var app = qlik.openApp("[Your App].qvf", config);
    $(".qvobject").each(function() {
        var qvid = $(this).data("qvid");
        app.getObject(this, qvid);
    });
    //get objects -- inserted here --
    //create cubes and lists -- inserted here --
    app.createCube({
        qDimensions: [{
            qDef: {
                qFieldDefs: ["[YOUR DIMENSION]"]
            }
        }],
        qMeasures: [{
            qDef: {
                qDef: "[YOUR MEASURE]",
                qLabel: ""
            }
        }],
        qInitialDataFetch: [{
            qHeight: 20,
            qWidth: 2
        }]
    }, function(reply) {
        var valueArray = [];
        //loop through the rows of the cube and push the values into the array
        $.each(reply.qHyperCube.qDataPages[0].qMatrix, function(index, value) {
            if (!this[0].qIsEmpty) {
                valueArray.push(this[1].qNum);
            }
            //create the pie chart
        });
        $("#pieChart").sparkline(valueArray, {
            type: 'pie',
            width: $("#pieChart").width(),
            height: $("#pieChart").height()
        });
    });

});