$(function() {

	var FIELD_HEIGHT = 9
	var FIELD_WIDTH = 9;

	var margin_left = 150;
	var margin_top = 25	;
	var current_color = '#ddd';

	var fields = [];
	var parkColors = ['#00008C','#006400','#808080','#8B008B','#818000','#4682B4','#E9967A','#2E4E4D','#EFEFEF'];
	var f = [];

	//-----Temperory parks
	/*
	f[parkColors[0]] = {"trees":0, "ids": [1,9,17,25,33,41,26]}; 
	f[parkColors[1]] = {"trees":0, "ids": [2,3,4,5,10,11,18,19]};
	f[parkColors[2]] = {"trees":0, "ids": [6,7,8,12,13,14,15,16,20,22,23,24]};
	f[parkColors[3]] = {"trees":0, "ids": [39,47,55,56,59,60,61,62,63,64]};
	f[parkColors[4]] = {"trees":0, "ids": [21,27,28,29,34,35,36,43]};
	f[parkColors[5]] = {"trees":0, "ids": [42,49,50,51,57,58]};
	f[parkColors[6]] = {"trees":0, "ids": [37,44,45,52,53,54]};
	f[parkColors[7]] = {"trees":0, "ids": [30,31,32,38,40,46,48]};
	*/	
	//----------------------
	for (var row = 1; row <= FIELD_HEIGHT; row++) 
	{
		for (var col = 1; col <= FIELD_WIDTH; col++) 
		{
			var field_id = (row-1)*FIELD_WIDTH+col;
			$("#container").append('<div class="field" id="'+field_id+'" style="margin-left: '+margin_left+'px; margin-top:'+margin_top+'px">'+field_id+'</div>');

			fields[field_id] = {"row":row, "col":col, "color":"#ddd", "status":"empty"};
			margin_left += 52;
		}
		margin_left = 150;
		margin_top += 52;
	}

	for (var i = parkColors.length - 1; i >= 0; i--) {
		$("#colorlist").append('<li class="choicecolor" id="'+parkColors[i]+'" style="background-color:'+parkColors[i]+';"></li>');
	}


	$('.choicecolor').click(function() { 
        var id = $(this).attr('id');
        $( ".currentcolor #current" ).css( "background-color", id);
        current_color = id;
        return false; 
    });

   $('.field').click(function() { 
        var id = $(this).attr('id');
        $( this ).css("background-color", current_color);

        if ( f[current_color] === undefined ){
        	f[current_color] = {"trees":0, "ids": [parseInt(id)]}; 	
        }
        else{
        	f[current_color].ids.push(parseInt(id));
        }
        return false; 
    });

   function getAdj(id, w, h){

   		if (id == 1) // left up
   			return [id+w,id+w+1,id+1];

   		else if (id == w) // right up
   			return [id-1,id+w,id+w-1];

   		else if (id == w*(h-1)+1) // left down
   			return [id+1,id-w,id-w+1];

   		else if (id == w*h) // right down
   			return [id-1,id-w-1,id-w];

   		else if (id % w - 1 == 0) // left
   			return [id+w,id+w+1,id+1,id-w,id-w+1];

   		else if (id % w == 0) // right
   			return [id+w,id+w-1,id-1,id-w,id-w+1];

   		else if (id < w+1) // up
   			return [id+w-1,id+w,id+w+1,id-1,id+1];

   		else if (id > w*(h-1)) // down
   			return [id-1,id+1,id-w-1,id-w,id-w+1];


   		return [id+w-1,id+w,id+w+1,id-1,id+1,id-w-1,id-w,id-w+1];
   }

   function sum(a){
		var result=0;
		for (var i=a.length; i--;) {
	   		result+=a[i];
		}
		return result;
	}

	function showResult(result){
		for (var i = result.length - 1; i >= 0; i--) {
			$("#"+result[i]).append('<div id="tree" style="margin-left: '+$( "#"+result[i] ).css("margin-left")+'px; margin-top:'+$( "#"+result[i] ).css("margin-top")+'px"></div>');
		}
	}

   function solveParks(r, restricted_cells){
   		var last_number = FIELD_WIDTH-2// etc. 4,3,2,1.
   		var current_number = -1;
   		var current_tree_pos = 1;
   		var figures = sum(Array.apply(null, {length: last_number+1}).map(Number.call, Number));
   		var whole_rows = FIELD_WIDTH*(r-1);
   		var last_placed_trees = [];
   		var restricted_cells_new = [];

	   	for (var i = 1; i < figures+1; i++) 
	   	{
		   	fields[current_tree_pos-1+2+current_number+whole_rows].status = "empty"; // delete previous second tree
		   	fields[current_tree_pos+whole_rows].status = "empty"; // delete previous tree

	   		current_number++;
	   		if ( current_number >= last_number){
		   		last_number--;
		   		current_number = 0;
		   		current_tree_pos++;
		   	}

	   		if ($.inArray(current_tree_pos+whole_rows, restricted_cells) == -1 && $.inArray(current_tree_pos+whole_rows+2+current_number, restricted_cells) == -1) 
	   		{
		   		restricted_cells_new = [];
		   		
		   		fields[current_tree_pos+whole_rows].status = "tree"; // new tree
		   		last_placed_trees[1] = current_tree_pos+whole_rows;

		   			fields[current_tree_pos-1+2+current_number+whole_rows].status = "empty"; // delete previous second tree

		   		if ( current_tree_pos > 1 ){ // on first tree change
		   			fields[current_tree_pos-1+whole_rows].status = "empty"; //delete previous tree		   	
				   	fields[r*FIELD_WIDTH].status = "empty"; //delete last second tree   			
		   		}	
		   		fields[current_tree_pos+2+current_number+whole_rows].status = "tree"; //new first second tree	
		   		last_placed_trees[2] = current_tree_pos+2+current_number+whole_rows;

		   		adjacents = getAdj( parseInt(current_tree_pos+whole_rows), FIELD_WIDTH, FIELD_HEIGHT) ;
	   			adjacents2 = getAdj( parseInt(current_tree_pos+2+current_number+whole_rows), FIELD_WIDTH, FIELD_HEIGHT) ;
				restricted_cells_new = Array.prototype.concat.apply(adjacents, adjacents2);

		   		if (r < FIELD_HEIGHT) {
		   			var returned_val = solveParks(r+1, restricted_cells_new);
		   			if (returned_val.length > 1) return Array.prototype.concat.apply(returned_val,last_placed_trees);

		   		}
		   		else{
		   			f["#00008C"] = f["#006400"] = f["#808080"] = f["#2E4E4D"] = f["#EFEFEF"] = 0;
					f["#8B008B"] = f["#4682B4"] = f["#E9967A"] = f["#818000"] = 0;

		   			var tree_count_in_col;
		   			for (var c_col = 1; c_col < FIELD_WIDTH+1; c_col++) 
		   			{
		   				tree_count_in_col = 0;
		   				for (var c_row = 0; c_row < FIELD_HEIGHT; c_row++) 
		   				{
		   					if (fields[c_row*FIELD_WIDTH+c_col].status == "tree"){
		   						tree_count_in_col++;
		   						f[fields[c_row*FIELD_WIDTH+c_col].color] +=1;
		   					}
		   				}
		   				if (tree_count_in_col > 2) break;
		   			};
		   			if (c_col == FIELD_WIDTH+1 && c_row == FIELD_WIDTH){
		   				console.log("Ir1");
		   				var parks_ok = true;
		   				for (var c = parkColors.length - 1; c >= 0; c--) {
		   					if (f[parkColors[c]] != 2){
		   						parks_ok = false;
		   						break;
		   					};
		   				};
		   				if (parks_ok) {
		   					console.log("Ir"); 
		   					return last_placed_trees;				
		   				}
		   			}
		   		}
	   		}else{
	   			if ($.inArray(current_tree_pos+whole_rows, restricted_cells) != -1 ) { //add speed.
	   				i += last_number-1;		// if not first tree than current iteration is increased to end a loop faster.
	   				last_number--;
	   				current_number = -1;
	   				current_tree_pos++;
	   			}
	   		}
	   	}
		if (last_placed_trees.length > 0){
			fields[last_placed_trees[1]].status = "empty";
			fields[last_placed_trees[2]].status = "empty";
		}
	   	return r;
 	}

 	$('#bttn-solve').click(function() { 
	 	for (var row = 1; row <= FIELD_HEIGHT; row++) 
		{
			for (var col = 1; col <= FIELD_WIDTH; col++) 
			{
				var field_id = (row-1)*FIELD_WIDTH+col;

				for (var i = parkColors.length - 1; i >= 0; i--) 
				{
					if ($.inArray(field_id, f[parkColors[i]].ids) > -1){
						var color = parkColors[i];
						fields[field_id] = {"row":row, "col":col, "color":color, "status":"empty"};
					}
				}
				margin_left += 51;
			}
			margin_left = 150;
			margin_top += 51;
		}

 		var d = new Date();
		var start = d.getTime();

		showResult(solveParks(1,[]));
		
		d = new Date();
		console.log(d.getTime() - start);
    });
   //console.log(performance.timing.connectEnd - performance.timing.connectStart);
});