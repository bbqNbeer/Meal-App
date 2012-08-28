//$(function(e) {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	function onDeviceReady(){
		alert('The Device is Ready!');
	}
	
	// Create the database
	var meals = Lawnchair({name:'meals'},function(e){
		//console.log('storage open');
	});
	
	var categories = Lawnchair({name:'categories'},function(e){
		//console.log('storage open');
	});

	function UpdateCategories(){
			// meals.all(function(arrMeals){
				// var cat_array = [];
				// for(var i = 0; i<arrMeals.length;i++)
				// {
					// var meal = arrMeals[i].value,
								// cat_name = meal.category_name,
								// cat_id = meal.category_id,
								// array = [cat_name, cat_id];
								// cat_array.push(array);
					// console.log(cat_array);
					// console.log(meal.category_name);
					//console.log(meal.category_id);
				// }
		// });
	
	}

	
	// clear the db
	//meals.nuke();
	
	function ReduceCategories(){
			categories.all(function(array){
			for(var i = 0; i<array.length;i++)
			{
				var cat = array.value;
				console.log(cat);
			}
			$('#meals').listview("refresh");
		});
	}
	
	function SaveNewCategory(){
				alert('Begin save cat');
		var new_cat = $('#addcategory').val(),
					last_option_val = $('#category option:last-child').val();
					new_option_val = parseInt(last_option_val) + 1,
					new_option = '<option value="' + new_option_val + '">' + new_cat + '</option>';
					categories.save({key: new_option_val, name: new_cat }); 
					//console.log(categories);
		$('#category').append(new_option);
	}
	
	function ValidateInput(elementID, displayText){
		$(elementID).val(displayText).css({ 'border' : 'solid 1px red', 'color' : 'red' });
		$(elementID).focus(function(){
			$(this).val('').attr('placeholder', '').css({ 'border' : 'solid 1px red', 'color' : '#AAA' });
		});
	}
	
	function SaveMeal(){
		alert('Begin save meal');
		var name = $('#name').val(),
					category_name = $('#category option:selected').text(),
					category_id = $('#category').val(),
					comment = $('#comments').val(),
					rating = $('#rating').val(),
					link = $('#link').val(),
					cat_options = $('#category').find('option'),
					cat_options_len = cat_options.length,
	        mealID = randomUUID(),
					meal = { name: name, category: category_name, category_id: category_id, comments: comment, rating: rating, link: link };
					
					//console.log(category_name);
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
			if(category_id != '0'){
				//console.log('save meal');
				//console.log(category_name);
				meals.save({key: mealID, value:meal}); 
				var page_url = '#meal?mealID=' + mealID;
				$.mobile.changePage(page_url, 'none');
			} else {
			  //console.log('save failed');
				$('#category').parent().css({ 'border' : 'solid 1px red', 'color' : 'red' });
				$('#category').change(function(){
					if($(this).val() != 0) {
						$(this).parent().removeAttr('style');
					} else {
						$('#category').parent().css({ 'border' : 'solid 1px red', 'color' : 'red' });
					}
				});
			}
		}

		var item = '<li id="' + mealID + '" data-mini="true"><a href="#meal" data-transition="slide">' + name + '</a></li>';
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
			//console.log('results: ' + results[1]);
		
			return mealID || 0;
		}
		
		var meal_id = $.urlParam('mealID');
		meals.get(meal_id, function(results){
			var meal = results.value;
			//console.log(meal);
			$('#meal h1').text(meal.name);
			$('#meal h2').text(meal.category);
			$('#meal .rating').text(meal.rating);
			$('#meal .notes').text(meal.comments);
			$('#meal .recipe-link').attr('href', meal.link).text(meal.link);
		});

	}
		
	// Get all meals and display them
	function AllMeals(){
	
		 meals.all(function(arrMeals){
			for(var i = 0; i<arrMeals.length;i++)
			{
				var mealID = arrMeals[i].key;
				//var item = '<li id="' + mealID + '">' + arrMeals[i].value.name + '<a class="edit" onclick="' + EditMeal(mealID) + '" href="#">Edit Meal</a></li>';
				//var item = '<li data-mini="true"><a class="" id="' + mealID + '" href="#">' + arrMeals[i].value.name + '</a></li>';
				var item = '<li data-mini="true" id="' + mealID + '"><a href="#meal?mealID=' + mealID + '" data-transition="slide">' + arrMeals[i].value.name + '</a></li>';
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
/* 		$('#edit-meal').live('pageinit', function(event){
				$('#meals').listview("refresh");
		}); */
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
				//console.log('home page init');
				UpdateCategories();
				ReduceCategories();
			});
			
			$('#home').live('pageshow', function(){
					//console.log('home page show');
					$('#meals').listview('refresh');
			});

			$('#add-meal').live('pageshow', function(){
				//console.log('add meal page show');
				$('#savecategory').click(function(e){
					//alert('save cat');
					SaveNewCategory();
					$('#category_add_new.ui-dialog').dialog('close');
				});
			
				$('#addmeal').click(function(){
					SaveMeal();
				});
			});
			
		$('#settings').live('pageshow', function(){
			$('#delete_db').click(function(){
				meals.nuke();
			});
			
			$('#delete_cat').click(function(){
				categories.nuke();
			});
							
		});
		
		$('#meal').live('pageshow', function(event){
			//console.log('meal page');
			var current_url = window.location.href;
			//console.log('meal page url: ' + current_url);
			MealView();

	});
	 

	
//});

