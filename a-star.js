var parents= {
}

var last_node = null;
var last_score = null;
var mainSource = null;

function search_path(start,goal,data){
    var open_list = [];
    var closed_list = [];
    var active_paths = [];
    mainSource = start;
    open_list.push({"node":start,"score":calculate_score([start],start,data),"parent":last_node});
    //console.log(calculate_score([start],start,data))
    
    while (open_list.length > 0){
        var current_node = open_list[minimumScoredNodeIndex(open_list)]['node'];
        var current_score = parseFloat(open_list[minimumScoredNodeIndex(open_list)]['score']);
        last_score = open_list[minimumScoredNodeIndex(open_list)]['score'];
        //console.log(open_list);
        //console.log("Current: "+current_node+"======== Last:"+open_list[minimumScoredNodeIndex(open_list)]['parent']+"==== H: "+open_list[minimumScoredNodeIndex(open_list)]['score']);
        last_node = open_list[minimumScoredNodeIndex(open_list)]['node'];
        var exist = false;
        for(var i=0;i<closed_list.length;i++){
            if(closed_list[i]['node']===current_node){
                if(parseFloat(closed_list[i]['score'])<current_score){
                    exist = true;
                    continue;
                }
                else{
                    //console.log(open_list[minimumScoredNodeIndex(open_list)]['score']+" less than "+closed_list[i]['score']+"====="+closed_list[i]['node'])
                    closed_list.push({"node":current_node,"parent":open_list[minimumScoredNodeIndex(open_list)]['parent'],"score":open_list[minimumScoredNodeIndex(open_list)]['score']});          
                    closed_list.splice(i,1);
                    exist = true;
                    break
                }
            }
        }
        if(exist===false){
            closed_list.push({"node":current_node,"parent":open_list[minimumScoredNodeIndex(open_list)]['parent'],"score":open_list[minimumScoredNodeIndex(open_list)]['score']});
        }

        open_list.splice(minimumScoredNodeIndex(open_list),1);
        
        var path = []
        if(current_node === goal){
            parents[current_node]={"parent":last_node};
            //console.log(closed_list);
            //console.log(current_node);
            //console.log(data);
            var path = pathTo(current_node,closed_list,data,[]);
            //console.log(path);
            //console.log(calculate_score(path,goal,data));
            path.unshift(mainSource);
            return path;
            break
        }else{
            for(var i=0;i<data[current_node]['targets'].length;i++){
                var current_neighbour = data[current_node]['targets'][i]['target'];
                var score_here = simple_score_calculation(last_score,current_node,current_neighbour,data);
                open_list.push({"node":current_neighbour,"score":score_here.toString(),"parent":last_node});
            }

            
    }
        

    }

}

function calculate_score(path,end,data){
    var total_score = 0;
    for(var i=0;i<path.length;i++){
        var current_targets = data[path[i]]['targets']
        var current_cost = 0; 
        for(var j=0; j< current_targets.length;j++){
           if(current_targets[j]['target'] === path[i+1]){
               total_score+= parseFloat(current_targets[j]['cost']);
           } 
        }
    }

    var end_heuristic = parseFloat(data[end]['heuristics'])
    total_score += end_heuristic; 
    //console.log(total_score)
    return total_score
    
}

function simple_score_calculation(lastScore,lastNode,currentNode,data){
    var total_score = 0;
    var lastNode_heuristics = parseFloat(data[lastNode]['heuristics']);
    var currentHeuristics = parseFloat(data[currentNode]['heuristics']);
    var currentTargets = data[lastNode]['targets'];
    var currentCost = 0
    for(var i=0;i<currentTargets.length;i++){
        if(currentTargets[i]['target'] === currentNode){
            currentCost = parseFloat(currentTargets[i]['cost']);
            break
        }
    }

    total_score = lastScore - lastNode_heuristics;
    total_score = total_score + currentCost;
    total_score = total_score + currentHeuristics;
    return total_score;


}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function minimumScoredNodeIndex(value){
    var open_list_scores = [];
    var score_mirror_values = []
    for(var i = 0;i<value.length;i++){
        open_list_scores.push(parseFloat(value[i]['score']))
        score_mirror_values.push(value[i]['node'])
    }

    var minIndex = indexOfMin(open_list_scores)
    return minIndex
}

var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

function isConnected(source,dest,data){
    var targets = []
    for(var i=0;i<data[source]['targets'].length;i++){
        targets.push(data[source]['targets'][i]['target']);
    }
    //console.log(targets)
    if(contains.call(targets,dest)){
        return true
    }
    else{
        return false
    }
}

var pathTo = function(node,closed,data,path){
    var bigData = data;
    var closedList= closed;
    var current = node;
    for(var i=0;i<closedList.length;i++){
        if(closedList[i]['node']===current && current!=mainSource){
            path.unshift(closedList[i]['node']);    
            pathTo(closedList[i]['parent'],closedList,bigData,path)
        }
    }

    return path;
}

function minimumHeuristicPosibilityIndex(value){
    var list_heuristics = [];
    for(var i = 0;i<value.length;i++){
        list_heuristics.push(parseFloat(value[i]['heuristics']))
    }

    var minIndex = indexOfMin(list_heuristics)
    return minIndex
}



module.exports = {
    main:search_path};





