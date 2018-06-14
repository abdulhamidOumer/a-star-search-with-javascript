$( function() {
    $( ".node" ).draggable({ containment: "#centerContent"});
  
    
  
  } );

  var here = {
    "A":{
    "source":"A",
    "targets":[{"name":"C","heuristics":"56"},{"name":"B","heuristics":"76"}]
     },
     "B":{
        "source":"B",
        "targets":[{"name":"C","heuristics":"56"},{"name":"B","heuristics":"76"}]
     }
    };

    
here['C']={"C":{
    "source":"C",
    "targets":[{"name":"C","heuristics":"56"},{"name":"B","heuristics":"76"}]
 }}
console.log(here);
  

var current_connection = null;
var connection_number = 1;
var new_node = 1;
var mainData = {};

function changeCost(source , target,cost){
    for(var key in mainData){
        if(key===source){
            var targets = mainData[key]['targets'];
            for(var i=0;i<targets.length;i++){
                if(targets[i]['target']===target){
                    targets[i]['cost']=cost;
                }
            }
        }
    }

    for(var key in mainData){
        if(key===target){
            var targets = mainData[key]['targets'];
            for(var i=0;i<targets.length;i++){
                if(targets[i]['target']===source){
                    targets[i]['cost']=cost;
                }
            }
        }
    }

}

jsPlumb.ready(function () {
  
      // setup some defaults for jsPlumb.
      var instance = jsPlumb.getInstance({
        Connector : [ "Bezier", { curviness: 50 } ],
        Anchors : [ "Center", "Center" ],
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: { stroke: '#666' },
        EndpointHoverStyle: { fill: "orange" },
        HoverPaintStyle: { stroke: "orange" },
        ConnectionOverlays: [
              [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
          ],
          Container: "centerContent"
      });

      var menu = [{
        name: 'update',
        //img: 'images/update.png',
        title: 'update button',
        fun: function(){
            var heruristics = alertify.prompt( 'Enter New Cost', 'Please Enter a Number only Cost', 'Cost'
            , function(evt, value) {  
                if(/^\d+$/.test(value) == true){
                  current_connection.getOverlay("label").setLabel(value);
                  changeCost(current_connection.sourceId,current_connection.targetId,value);
                  alertify.success('Heuristics Saved')
                }
                else if(/^\d+$/.test(heruristics) == false){
                  alertify.error('Please Enter A Numbered Value');
                }
                console.log(value);
            }
            , function(evt,value) { 
              alertify.warning("Operation Cancelled!");
          }
          );
              }
    }, {
        name: 'delete',
        //img: 'images/delete.png',
        title: 'delete button',
        fun: function () {
            var sourceId = current_connection.sourceId;
            var targetId = current_connection.targetId;
            var sourceTargets = mainData[sourceId]['targets'];
            var targetTargets = mainData[targetId]['targets'];

            for(var i=0;i<sourceTargets.length;i++){
                var currentTarget = sourceTargets[i]['target'];
                if(currentTarget===targetId){
                    sourceTargets.pop(i);
                }
            }

            for(var i=0;i<targetTargets.length;i++){
                var currentTarget = targetTargets[i]['target'];
                if(currentTarget===sourceId){
                    targetTargets.pop(i);
                }
            }

            instance.deleteConnection(current_connection);
            alertify.success("Connection Deleted!!");
        },
        
    }
   ];
  
      instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
  
      window.jsp = instance;
  
      var canvas = $("#centerContent");
      var close_node= $(".closeNode");
      var windows = jsPlumb.getSelector(".node");
  
      instance.bind("dblclick", function (c) {
          instance.deleteConnection(c);
      });
  
       
      instance.bind("connection", function (info) {
          info.connection.getOverlay("label").setLabel(connection_number.toString());
          connection_number+=1;
          $('.aLabel').contextMenu(menu);
          var me = false;
          var source =info.connection.sourceId;
          var target = info.connection.targetId; 
          console.log(info)

            if(source in mainData){
                console.log("Source already exist in data..");
                mainData[source.toString()]['targets'].push({"target":info.connection.targetId, "cost":info.connection.getOverlay("label").label});
                console.log(mainData);
            }
            else{
            mainData[source.toString()]=
                {
                    "source": info.connection.sourceId,
                    "targets": [{"target":info.connection.targetId, "cost":info.connection.getOverlay("label").label}],
                    "heuristics":null
                        
              };
              
        }

        if(target in mainData){
            mainData[target.toString()]['targets'].push({"target":info.connection.sourceId, "cost":info.connection.getOverlay("label").label});
        }
        else{
            mainData[target.toString()]=
                {
                    "source": info.connection.targetId,
                    "targets": [{"target":info.connection.sourceId, "cost":info.connection.getOverlay("label").label}],
                    "heuristics":null
                        
              };
        }
          
        console.log(JSON.stringify(mainData));
    });

      instance.bind("click",function(c,typez){   
        $('.aLabel').contextMenu(menu);
           current_connection = c;
        
  });

  
      instance.bind("contextmenu",function(c,ev){
        ev.preventDefault();
        console.log("Right Click");
        return false;
      },false);
      // bind a double click listener to "canvas"; add new node when this occurs.
      var addNode = document.getElementById('addNode');
      jsPlumb.on(addNode, "click", function(e) {
        var id = alertify.prompt( 'New Name For Node', 'Please Enter a New Name', 'Name'
         , function(evt, value) {
            for(var key in mainData){
                if(key===value){
                    alertify.error("Another node exists with the same name");
                    return;
                }
                else if(value === "" || value === " "){
                    alertify.error("Please Enter A name for the node.");
                    return;
                }
                else if(value.includes(" ")){
                    alertify.error("A node name can not contain spaces");
                    return;
                }
            }
            newNode(e.offsetX, e.offsetY,value);  
         }
        , function(evt,value) { 
            alertify.warning("Operation Cancelled!");
            return
            }
        );
      });
  
      //
      // initialise element as connection targets and source.
      //
      var initNode = function(el) {
  
          // initialise draggable elements.
          instance.draggable(el,{containment:"#centerContent"});
  
          instance.makeSource(el, {
              Endpoint: ["Dot", {radius: 2}],
              filter: ".ep",
              anchor: "Center",
              connectorStyle: { stroke: "#ffffff", strokeWidth: 4, outlineStroke: "transparent", outlineWidth: 1 },
              extract:{
                  "action":"the-action"
              }
          });
  
          instance.makeTarget(el, {
              dropOptions: { hoverClass: "dragHover" },
              anchor: "Center",
              allowLoopback: true
          });
  
        
          instance.fire("jsPlumbDemoNodeAdded", el);
        
      };
  
      var newNode = function(x, y,id) {
          var d = document.createElement("div");
          var cont = document.getElementById("centerContent");

          d.className = "node";
          d.id = id;
          d.innerHTML = "<p class=\"closeNode\" id = \"close_"+id+"\">&#10006;</p>"+
          "<p spellcheck=\"false\" class=\"nodeName\" id = \"title_"+id+"\">"+id+"</p>" +
          "\n <div class=\"ep\"></div>";


          d.style.left = x + "px";
          d.style.top = y + "px";
          instance.getContainer().appendChild(d);
          
          
        var sourceSelect = document.getElementById("sourceInput");
        var goalSelect = document.getElementById("goalInput");
        var opt = document.createElement('option');
        opt.value = id;
        opt.id = id;
        opt.innerHTML = id;
        sourceSelect.appendChild(opt);

        var opt = document.createElement('option');
        opt.value = id;
        opt.id = "option_"+id;
        opt.innerHTML = id;
        goalSelect.appendChild(opt);
        initNode(d);

          $("#close_"+id).click(function(){
            instance.remove(id);
            deleteNodeInData(id);
            $("#sourceInput option[value = '"+id+"']").remove();
            $("#goalInput option[value = '"+id+"']").remove();
            alertify.success("Node Sucessfully deleted");
            });
          
        $("#title_"+id).click(function(){
            
          });

          mainData[id]=
                {
                    "source": id,
                    "targets": [],
                    "heuristics":null
                        
              };

            return d;

      };

      instance.batch(function () {
        for (var i = 0; i < windows.length; i++) {
            initNode(windows[i], true);
        }
        
        });
    
  
      instance.batch(function () {
  
      jsPlumb.fire("jsPlumbDemoLoaded", instance);
  
  });
 

    function deleteNodeInData(id){
       for(var key in mainData){
           var targets = mainData[key]['targets'];
           for(var i=0;i<targets.length;i++){
               var target = targets[i]['target'];
               if(target===id){
                   targets.pop(i);
               }
           }
           if(key===id){
               delete mainData[key];
           }
       }
    }

  $("#runStarAlgorithm").click( function(){
    var notice = document.getElementById("modalNotice");
    var goal = $("#goalInput").find(":selected").text();
    var source = $("#sourceInput").find(":selected").text();
    console.log(source);
    if(goal==="--Goal Node--" || source==="--Start Node--"){
        alertify.alert("<p style=\"color:red;\">Error</p>","Specify Both Start and Goal Node")
        return
    }

    var error_inputs = [];
       
        for(var key in mainData){
            var value = $("#inp_"+key).val();
            if(/^\d+$/.test(value) == true){
                continue;
            }
            else{
                error_inputs.push(key);
            }
        }
        if(error_inputs.length){
            alertify.alert("<p style=\"color:red;\">Error</p>","Please Enter Correct Heuristics at <br><br> &emsp;Error At:"+error_inputs.toString()+"");
            return
        }
        
    fetch('/findPath', {method:"POST",
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        body:JSON.stringify({source:source,goal:goal,mainData:mainData})})
        .then(function(response){
            response.json().then(res => {
                var short_path = res;
                var stringPath = "";
                try{
                    short_path.length;
                }
                catch(e){
                    alertify.alert("<p style=\"color:red;\">Calculation Error</p>","Please check all Connections<br>"+e.toString())
                }
                for(var i=0;i<short_path.length;i++){
                    if(i===0){
                        stringPath = "<p style=\"font-weight:bold;\">"+stringPath + short_path[i];
                    }
                    else{
                        stringPath = stringPath + "&rarr; "+short_path[i];
                    }
            
                }

                stringPath = stringPath+"</p>";
                alertify.alert("Shortest Path",stringPath);


            }).catch(function(err){
                console.log(err)
            });
        }).catch(function(err){
            alertify.alert("Server Error")
        })

        
  });
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("close")[0];

  $("#addHeuristics").click( function(){
    var notice = document.getElementById("modalNotice");
    var goal = $("#goalInput").find(":selected").text();
    var source = $("#sourceInput").find(":selected").text();

    if(goal==="--Goal Node--" || source==="--Start Node--"){
        notice.textContent = "Please Select both Start Node and Goal Node";
    }
    else{
        notice.textContent = "Add Numbered Heuristics";
        var inp = document.createElement("div");
        for(var key in mainData)
        {
            if($("#inp_"+key).length){
                continue;
            }
            else{
                inp.innerHTML += "<p style=\"display:inline-block;\">"+key+"</p> <div style=\"display:inline-block; float:right;\"><p style=\"display:inline-block;\" >Heuristics To Goal: </p><input type=\"text\" style=\"display:inline-block;\" id=\"inp_"+key+"\"></input></div><br><br>";
            }            
        }


        $(".modal-body").append(inp);
        }
        $(".node").hide();
        modal.style.display = "block";
        });

    $("#saveHeuristics").click(function(){
        var error_inputs = [];
       
        for(var key in mainData){
            var value = $("#inp_"+key).val();
            if(/^\d+$/.test(value) == true){
                continue;
            }
            else{
                error_inputs.push(key);
            }
        }
        if(error_inputs.length){
            alertify.alert("Error","Please Enter Correct Values <br><br> &emsp;Error At:"+error_inputs.toString()+"");
            return
        }
        else{
            for(var key in mainData){
                var value = value = $("#inp_"+key).val();
                mainData[key]['heuristics'] = value;
            }
            alertify.success("Values Saved");
            modal.style.display = "none";
            $(".node").css('display','inherit');
        }
    });

  span.onclick = function() {
    modal.style.display = "none";
    $(".node").css('display','inherit');
}



});

