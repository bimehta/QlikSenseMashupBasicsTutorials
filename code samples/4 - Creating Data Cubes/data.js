var first = 0;
var currentReg = "";
//Configure the call to the API.  Set host to your server name
var config = {
  host : "[YOUR SERVER HERE]",
  prefix : "/",
  port : window.location.port,
  isSecure : window.location.protocol === "https:"
};
require.config({
  baseUrl : (config.isSecure ? "https://" : "http://") + config.host + ":" + config.port + config.prefix + "resources"
});
require(["js/qlikview"], function(qlikview) {
  qlikview.setOnError(function(error) {
    alert(error.message);
  });
  qlikview.getAppList(function(reply) {
    //include the external JS library here
    require(["jquery", "jqueryui", "http://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js"], function($) {
      //Loop through apps to find the one you want
      $.each(reply, function(key, value) {
        //set app to your app
        if (value.qDocName === "[YOUR APP NAME]") {
          var app = qlikview.openApp(value.qDocId, config);
          //create data cube. 
          //see here for more info http://betahelp.qliktech.com/daily/en-US/portal/index.html#../Subsystems/QlikView_Client_Protocol_API/Content/GenericObject/PropertyLevel/HyperCubeDef.htm
          app.createCube({
            //set dimensions
            qDimensions : [{
              qDef : {
                qFieldDefs : ["[DIMENSION]"]
              }
            }],
            //set measures
            qMeasures : [{
              qDef : {
                qDef : "[EXPRESSION]",
                qNumFormat : {
                  qType : "F",
                  qnDec : 2
                }
              }
            }],
            //set the size of the initial data fetch
            qInitialDataFetch : [{
              qTop : 0,
              qLeft : 0,
              qHeight : 20,
              qWidth : 2
            }]
          }, function(reply) {
            //create array to use for the pie chart
            var valueArray = [];
            //loop through the rows of the cube and push the values into the array
            $.each(reply.qHyperCube.qDataPages[0].qMatrix, function(index, value) {
              if (!this[0].qIsEmpty) {
                valueArray.push(this[1].qNum);
              }
              //create the pie chart
            });
             $("#pieChart").sparkline(valueArray, {
                type : 'pie',
                width : $("#pieChart").width(),
                height : $("#pieChart").height()
              });
          });
        }
      });
    });
  }, config);
});

