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
	
	function SaveNewCategory(){
		var new_cat = $('#addcategory').val(),
					last_option_val = $('#category option:last-child').val();
					new_option_val = parseInt(last_option_val) + 1,
					new_option = '<option value="' + new_option_val + '">' + new_cat + '</option>';
		$('#category').append(new_option);
	}
	
	function ValidateInput(elementID, displayText){
		$(elementID).val(displayText).css({ 'border' : 'solid 1px red', 'color' : 'red' });
		$(elementID).focus(function(){
			$(this).val('').attr('placeholder', '').css({ 'border' : 'solid 1px red', 'color' : '#AAA' });
		});
	}
	
	function SaveMeal(){
		var name = $('#name').val(),
					category_name = $('#category').val(),
					category_id = $('#category').val(),
					comment = $('#comments').val(),
					rating = $('#rating').val();
					link = $('#link').val(),
					cat_options = $('#category').find('option');
					cat_options_len = cat_options.length;
	        mealID = randomUUID(),
					meal = { name: name, category_name: category_name, category_id: category_id, comments: comment, rating: rating, link: link };
					
    // meal name must be greater than 3 characters
		if(name.length <= 4){
			ValidateInput('#name', 'Meal name must be longer than 3 characters');
		} else {
			// make sure the category name doesn't already exist
			for(i = 0; i <= cat_options_len; i++){
				var option_text = $(cat_options[i]).text();
				if(name === option_text){
					ValidateInput('#name', 'Meal name already exists, please enter a new name');
				} 
			}
			// check to see if a category has been selected
			if(category != 0){
				meals.save({key: mealID, value:meal}); 
			} else {
				console.log('category val: ' + category);
				$('#category').parent().css({ 'border' : 'solid 1px red', 'color' : 'red' });
				//$('#category option:first').css({ 'border' : 'solid 1px red', 'color' : 'red' });
				$('#category').change(function(){
					if($(this).val() != 0) {
						$(this).parent().removeAttr('style');
					} else {
						$('#category').parent().css({ 'border' : 'solid 1px red', 'color' : 'red' });
					}
				});
			}
		}
		//console.log(name + ' ' + category + ' ' + comment);
		
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
		//var item = '<li id="' + mealID + '">' + name + '<a class="edit" onclick="' + EditMeal(mealID) + '" href="#">Edit Meal</a></li>';
		var item = '<li id="' + mealID + '"><a href="#meal" data-transition="none">' + name + '</a></li>';
		$('#meals').append(item);
		//$('#meals').append('<a class="delete" onclick="' + DeleteMeal(mealID) + '" href="#">Delete Meal</a>');
		$('#add-meal').live('pageinit', function(event){
				$('#meals').listview("refresh");
		});
	}

	function MealView(){
			$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href),
						mealID = results[1];
			console.log('results: ' + results[1]);
		
			return mealID || 0;
		}
		
		$.urlParam('mealID');

	}
		
	// Get all meals and display them
	function AllMeals(){
	
		 meals.all(function(arrMeals){
			for(var i = 0; i<arrMeals.length;i++)
			{
				var mealID = arrMeals[i].key;
				//var item = '<li id="' + mealID + '">' + arrMeals[i].value.name + '<a class="edit" onclick="' + EditMeal(mealID) + '" href="#">Edit Meal</a></li>';
				//var item = '<li data-mini="true"><a class="" id="' + mealID + '" href="#">' + arrMeals[i].value.name + '</a></li>';
				var item = '<li data-mini="true" id="' + mealID + '"><a href="#meal?mealID=' + mealID + '" data-transition="none">' + arrMeals[i].value.name + '</a></li>';
				$('#meals').append(item);
				//$('#meals').append('<a class="delete" onclick="' + DeleteMeal(mealID) + '" href="#">Delete Meal</a>');
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
	//	$('#meals').listview("refresh");
		$('#edit-meal').live('pageinit', function(event){
				$('#meals').listview("refresh");
		});
	}
	
	function DeleteMeal(mealID){
		//console.log('DELETE!');
		//console.log(mealID);
		var element = $('#' + mealID);
		// TODO: remove() doesn't like a variable, works if i hard code the id as string
		meals.remove('1C6301CEF0522D467B18FCA409C490FF');
		//meals.remove(mealID);
		$(element).remove();
		//$('#meals').listview("refresh");
		$('#edit-meal').live('pageinit', function(event){
				$('#meals').listview("refresh");
		});
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
	
	// Jquery document ready events
		// $(document).ready(function(){
			// $('#meals').listview("refresh");
	 // });
	 
		$('#home').live('pageinit', function(){
				AllMeals();
				//$('#meals').listview('refresh');
				console.log('home page');
			});
			

			$('#add-meal').live('pageinit', function(){
				$('#savecategory').click(function(e){
					SaveNewCategory();
					$('#category_add_new.ui-dialog').dialog('close');
				});
			
				$('#addmeal').click(function(){
					SaveMeal();
				});
			});
			
		$('#settings').live('pageinit', function(){
			$('#delete_db').click(function(){
				meals.nuke();
			});
		});
		
		$('#meal').live('pageinit', function(event){
			console.log('meal page');
			var current_url = window.location.href;
			console.log('meal page url: ' + current_url);
			MealView();
		var meal_id = $.urlParam('mealID');
		meals.get(meal_id, function(results){
			var meal = results.value;
			console.log(meal);
			$('#meal h1').text(meal.name);
			$('#meal h2').text(meal.category);
			$('#meal .rating').text(meal.rating);
			$('#meal .notes').text(meal.comments);
			$('#meal .recipe-link').attr('href', meal.link).text(meal.link);
		});
	});
	 

	
//});

