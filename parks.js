$(function() {

	var FIELD_HEIGHT = 8;
	var FIELD_WIDTH = 8;

	var margin_left = 150;
	var margin_top = 25	;
	var current_color = '#00008C';
	var parks = 0;

	var fields = [];
	var parkColors = ['#00008C','#006400','#808080','#8B008B','#818000','#4682B4','#E9967A','#2E4E4D','#B8860A','#00BFFE','#FF8C00','#9831CC'];
	var currentPark = [];
	var f = [];

	var mouseDown = 0;
	document.body.onmousedown = function() { 
	    mouseDown = 1;
	}
	document.body.onmouseup = function() {
	    mouseDown = 0;
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

	$('#bttn-generate').click(function() { 
    	if ( isInt($('.height').val()) && isInt($('.width').val()) )
    	{
    		if ( $('.height').val() <= 12 && $('.width').val() <= 12 ){
		    	FIELD_HEIGHT = parseInt($('.height').val());
		    	FIELD_WIDTH = parseInt($('.width').val());
		    	generateParks(FIELD_WIDTH, FIELD_HEIGHT);
		    	document.getElementById("bttn-solve").disabled = false;
	    	}
    	}
    });

    $(document).on('mousedown mouseover', '.field', function() {
    	if (mouseDown == 1) {
    		var id = $(this).attr('id');
	        $( this ).css("background-color", current_color);

	        if ( f[current_color] === undefined ){
	        	f[current_color] = {"trees":0, "ids": [parseInt(id)]}; 	
	        	currentPark.push(current_color);
	        }
	        else if ($.inArray(parseInt(id), f[current_color].ids) == -1){
	        	f[current_color].ids.push(parseInt(id));
	        }
	        console.log(f[current_color].ids); 
		}
	});

 	$('#bttn-solve').click(function() { 
	 	for (var row = 1; row <= FIELD_HEIGHT; row++) 
		{
			for (var col = 1; col <= FIELD_WIDTH; col++) 
			{
				var field_id = (row-1)*FIELD_WIDTH+col;

				for (var i = currentPark.length - 1; i >= 0; i--) 
				{
					if ($.inArray(field_id, f[currentPark[i]].ids) > -1){
						var color = currentPark[i];
						fields[field_id] = {"row":row, "col":col, "color":color, "status":"empty"};
					}
				}
				margin_left += 51;
			}
			margin_left = 150;
			margin_top += 51;
		}
		console.log(fields);

 		var d = new Date();
		var start = d.getTime();

		showResult(solveParks(1,[])); // solving game and showing result
		
		d = new Date();
		$( "#bttn-solve" ).html("Solved in: "+(d.getTime() - start)+"ms");
		console.log(d.getTime() - start);
    });

    function generateParks(w, h){
    	for (var row = 1; row <= h; row++) 
		{
			for (var col = 1; col <= w; col++) 
			{
				var field_id = (row-1)*w+col;
				$("#container").append('<div unselectable="on" onselectstart="return false;" onmousedown="return false;"class="field" id="'+field_id+'" style="margin-left: '+margin_left+'px; margin-top:'+margin_top+'px">'+field_id+'</div>');

				fields[field_id] = {"row":row, "col":col, "color":"#ddd", "status":"empty"};
				margin_left += 52;
			}
			margin_left = 150;
			margin_top += 52;
		}
    }

    function isInt(value) {
	  var x;
	  if (isNaN(value)) {
	    return false;
	  }
	  x = parseFloat(value);
	  return (x | 0) === x;
	}


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
	   		//$("#"+(current_tree_pos-1+2+current_number+whole_rows)).css("background-color", "#ddd"); // delete previous second tree
		   	//$("#"+(current_tree_pos+whole_rows)).css("background-color", "#ddd"); // delete previous tree
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

		   		var tree_count_in_col1 = 0; 
		   		var tree_count_in_col2 = 0;
	   			for (var c_down = 0; c_down < r; c_down++) // improvements: count trees in col. huge speed up
			   	{
			   		if (fields[c_down*FIELD_WIDTH+current_tree_pos].status == "tree"){
			  			tree_count_in_col1++;
			   		}
			   		if (fields[c_down*FIELD_WIDTH+current_tree_pos+2+current_number].status == "tree"){
			   			tree_count_in_col2++;
			   		}
			   	}
			   	if (tree_count_in_col1 < 2 && tree_count_in_col2 < 2){
		   		
			   		restricted_cells_new = [];

			   		//$("#"+(current_tree_pos+whole_rows)).css("background-color", "#555"); // new tree
			   		fields[current_tree_pos+whole_rows].status = "tree"; // new tree
			   		last_placed_trees[1] = current_tree_pos+whole_rows;
			   		
			   		//$("#"+(current_tree_pos-1+2+current_number+whole_rows)).css("background-color", "#ddd"); // delete previous second tree
					fields[current_tree_pos-1+2+current_number+whole_rows].status = "empty"; // delete previous second tree

			   		if ( current_tree_pos > 1 ){ // on first tree change
			   			//$("#"+(current_tree_pos-1+whole_rows)).css("background-color", "#ddd");	//delete previous tree
			   			//$("#"+(r*FIELD_WIDTH)).css("background-color", "#ddd"); //delete last second tree
			   			fields[current_tree_pos-1+whole_rows].status = "empty"; //delete previous tree		   	
					   	fields[r*FIELD_WIDTH].status = "empty"; //delete last second tree   			
			   		}	
			   		//$("#"+(current_tree_pos+2+current_number+whole_rows)).css("background-color", "#999"); //new first second tree
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
			   			for (var park_color = currentPark.length - 1; park_color >= 0; park_color--) {
			   				f[currentPark[park_color]] = 0;
			   			}

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
			   				var parks_ok = true;
			   				for (var c = currentPark.length - 1; c >= 0; c--) {
			   					if (f[currentPark[c]] != 2){
			   						parks_ok = false;
			   						break;
			   					};
			   				};
			   				if (parks_ok) {
			   					return last_placed_trees;				
			   				}
			   			}
			   		}
			   	}
	   		}
	   	}

		if (last_placed_trees.length > 0){
			//$("#"+(last_placed_trees[1])).css("background-color", "#ddd");
			//$("#"+(last_placed_trees[2])).css("background-color", "#ddd");
			fields[last_placed_trees[1]].status = "empty";
			fields[last_placed_trees[2]].status = "empty";
		}
	   	return r;
 	}

   //console.log(performance.timing.connectEnd - performance.timing.connectStart);
});