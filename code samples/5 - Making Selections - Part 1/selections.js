/*global require, alert*/
/*
 * 
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for QlikView engine
 */
var config = {
    host: window.location.hostname,
    prefix: "/",
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};
require.config( {
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
    qlik.setOnError( function ( error ) {
        alert( error.message );
    } );

    //callbacks
    //open app and get objects
    var app = qlik.openApp("[APP NAME]", config);
    $(".qvobject").each(function() {
        var qvid = $(this).data("qvid");
        app.getObject(this, qvid);
    });
  
    
  
    app.createList({
                        "qDef" : {
                            //specify the field
                            "qFieldDefs" : ["YOUR FIELD NAME"]
                        },
                        //specify max number of rows you want to pull back
                        "qInitialDataFetch" : [{
                            qTop : 0,
                            qLeft : 0,
                            qHeight : 20,
                            qWidth : 1
                        }]
                    }, function(reply) {
                        //console.info(reply);
                        //empty out the Div you've created to hold the list
                        $("#fieldList").empty();
                        //get the Object
                        var qObject = reply.qListObject;
                        //Loop through the data returned
                        $.each(qObject.qDataPages[0].qMatrix, function() {
                            //get the current item
                            var item = this[0];
                            var selT = "";
                            //Check to see if it's selected, if so, set the list item to bold
                            if (item.qState == "S") {
                                currentReg = item.qText;
                                selT = " style=\"font-weight:bold;\"";
                            }
                            //append the item to the list
                            $("#fieldList").append("<li" + selT + ">" + item.qText + "</li>");
                        });
                        //add the ability for the item to be clicked and selected in QlikView
                        $("#fieldList li").click(function() {
                            app.field("YOUR FIELD NAME").selectMatch($(this).text(), false);
                        });

                        /*
                         //CODE FOR CREATING AN ARRAY OF SELECTIONS TO SEND
                        function checkArray(arr,item){
                            var index = -1;
                            $.each(arr,function(i){
                                if(this.qText == item.qText){
                                    index = i;
                                    return false;
                                }
                            });
                            return index;
                        }
                        
                        var selArray = [];
                        $("#fieldList li").click(function() {
                            var sel = {qText:$(this).text()};
                            var index = checkArray(selArray,sel);
                            if(index > -1){
                                 $(this).css("font-weight","normal");
                                 selArray.splice(index);
                            }else{
                                $(this).css("font-weight","bold");
                                selArray.push({qText:$(this).text()});    
                            }
                            console.info(selArray);
                        });
                        $("#submitThis").click(function() {
                            app.field('YOUR FIELD NAME').selectValues(selArray, true, true);
                            selArray = [];
                        });
                        */
                        */
                    });

} );