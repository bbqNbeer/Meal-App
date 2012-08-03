//$(function(e) {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	function onDeviceReady(){
		//alert('The Device is Ready!');
	}
	
	// Create the database
	var meals = Lawnchair({name:'meals'},function(e){
		//console.log('storage open');
	});
	
	// clear the db
	//meals.nuke();
	
	function SaveMeal(){
		var name = $('#name').val();
		var category = $('#category').val();
		var comment = $('#comments').val();
		var rating = $('#rating').val();
		var link = $('#link').val();
		
		//console.log(name + ' ' + category + ' ' + comment);
		var mealID = randomUUID();
		var meal = { name: name, category: category, comments: comment, rating: rating, link: link };
		meals.save({key: mealID, value:meal}); 
		
//		var obj1 = {beername:"Wet Hop",brewername:"Deschuttes",brewerlocation:"Bend, OR"
//			,beerstyle:"IPA",quantity:1,purchasedate:"12/11/2011",price:"9.00"
//			,cellardate:"9/11/2011",cellartemp:40,brewdate:"8/10/2011"};
//		var obj2 = {beername:"Vertical Epic 11",brewername:"Stone",brewerlocation:"San Diego, CA"
//			,beerstyle:"Belgian",quantity:1,purchasedate:"1/10/2011",price:"15.00"
//			,cellardate:"1/12/2011",cellartemp:45,brewdate:"10/10/2010"};				
//		meals.save({key:"1",value:obj1});   	
//		meals.save({key:"2",value:obj2});
		//alert(obj1.beername);
		
		// Append the saved meal to the displayed list
		var item = '<li id="' + mealID + '">' + name + '<a class="edit" onclick="' + EditMeal(mealID) + '" href="#">Edit Meal</a></li>';
		$('#meals').append(item);
		//$('#meals').append('<a class="delete" onclick="' + DeleteMeal(mealID) + '" href="#">Delete Meal</a>');
		$('#meals').listview("refresh");
	}
		
	// Get all meals and display them
	function AllMeals(){
		 meals.all(function(arrMeals){
			for(var i = 0; i<arrMeals.length;i++)
			{
				//var section = '<li><section>' + arrMeals[i].value.beername + '</section></li>';
				var mealID = arrMeals[i].key;
				var item = '<li id="' + mealID + '">' + arrMeals[i].value.name + '<a class="edit" onclick="' + EditMeal(mealID) + '" href="#">Edit Meal</a></li>';
				$('#meals').append(item);
				$('#meals').append('<a class="delete" onclick="' + DeleteMeal(mealID) + '" href="#">Delete Meal</a>');
			}
			$('#meals').listview("refresh");
		});
	}
	
	function EditMeal(mealID){
		//var mealID = mealID;
		//console.log(mealID);
		//var id = $('.edit').parent
		meals.get(mealID, function(thisobj){
			//console.log(thisobj);
			var obj = {};
			obj = thisobj.value;
			obj.name = "NEW NAME";
			meals.save({ key: thisobj.key, value: obj });
		});
		$('#meals').listview("refresh");
	}
	
	function DeleteMeal(mealID){
		console.log('DELETE!');
		console.log(mealID);
		var element = $('#' + mealID);
		// TODO: remove() doesn't like a variable, works if i hard code the id as string
		meals.remove('1C6301CEF0522D467B18FCA409C490FF');
		//meals.remove(mealID);
		$(element).remove();
		$('#meals').listview("refresh");
	}
	
	// Create randome ID
	function randomUUID(){
		var s = [], itoh = '0123456789ABCDEF';
		
		for(var i = 0; i < 32; i++){
			s[i] = Math.floor(Math.random()*0x10);
		}
		s[14] = 4;
		s[19] = (s[19] & 0x3) | 0x8;
		
		for(var i = 0; i < 36; i++){
			s[i] = itoh[s[i]];
		}
		return s.join('');
	}
	
	//SaveMeal();
	AllMeals();
//});

