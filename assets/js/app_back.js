
	//document.addEventListener('deviceready', onDeviceReady, false);
	
	var db = window.openDatabase('meals', '1.0', 'meals', 1000000);
	db.transaction(createDB, errorHandler, onSuccessDB);	


function saveToDB(){
	db.transaction(insertRow, errorHandler, onSuccessDB)
}

function createDB(tx){
	//tx.executeSql('DROP TABLE IF EXISTS meals');
	tx.executeSql('CREATE TABLE IF NOT EXISTS meals(id PRIMARY KEY, name VARCHAR, category VARCHAR, comments VARCHAR, rating INTEGER, link TEXT, linkText VARCHAR)');
}

function insertRow(tx){
	var name = $('#name').val();
	var category = $('#category').val();
	var comment = $('#comments').val();
	var rating = $('#rating').val();
	var link = $('#link').val();
	var randomid = randomUUID();
	tx.executeSql('INSERT INTO meals (id, name, category, comments, rating, link, linkText) VALUES("' + randomid + '", "' + name + '", "' + category + '", "' + comments + '", "' + rating + '", "' + link + '", "' + linkText + '")');
}

function errorHandler(e){
	//alert(e.message);
	alert('Error processing SQL: ' + e);
}

function onSuccessDB(e){
	//$('#results').append('<p>New Row saved!</p>');
	console.log('New record saved!');
}

function queryDB(tx){
	tx.executeSql('SELECT * FROM meals', [], querySuccess, errorHandler);
}
var allMeals = [];
var records;
function querySuccess(tx, results){
	var len = results.rows.length;
	var records = "";
	for(var i=0; i < len; i++){
		var rows = results.rows.item(i);
		var record = '<section>';
		 record += '<img src="../img/food.jpg" />';
		 record += '<h2>' + results.rows.item(i).name + '</h2><span data-bind="text: category"></span>';
		 record += '<div class="comments" data-bind="text: comments">' + results.rows.item(i).comments + '</div>';
		 record += '<div class="rating" data-bind="text: rating">' + results.rows.item(i).rating + '</div>';
		 record += '<a href="' + results.rows.item(i).link + '">' + results.rows.item(i).linkText + '</a><br />';
		 record += '<a href="#" data-bind="click: $parent.removeMeal">Delete</a>';
		 record += '</section>';
		 $('#results').append(record);
	}
	
	//console.log(allMeals);
	newMeals = allMeals;
	return records;
}

console.log(records);

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

db.transaction(queryDB, errorHandler);

// ------------------------ knockout functions ----------- //
(function($){
	var recipesArray = db;
	
	function Recipe(data) {
	    this.name = ko.observable(data.name);
	    this.category = ko.observable(data.category);
	    this.comments = ko.observable(data.comments);
	    this.rating = ko.observable(data.rating);
	    this.link = ko.observable(data.link);
	    this.link_text = ko.observable(data.link_text);
		this.catergories = ko.observableArray();
	}
	
	function RecipeViewModel() {
		var self = this;
	    this.addname = ko.observable();
	    this.addcategory = ko.observable();
	    this.selectcategory = ko.observable();
	    this.addcomments = ko.observable();
	
			
	this.recipesArray = ko.observableArray([
	     { name: "Meal1", category: "Food Type 1", comments: "comment 1", rating: "7 of 10", link: "http://www.google.com", link_text: "google" },
		 { name: "Meal 2", category: "Food Type 2", comments: "comment 2", rating: "2 of 10", link: "http://www.recipes.com", link_text: "recipes" },
		 { name: "Meal 3", category: "Food Type 1", comments: "comment 3", rating: "5 of 10", link: "http://www.pauladean.com", link_text: "paula dean" },
	     { name: "Meal 4", category: "Food Type 2", comments: "comment 4", rating: "9 of 10", link: "http://www.google.com", link_text: "google" },
		 { name: "Meal 5", category: "Food Type 3", comments: "comment 5", rating: "10 of 10", link: "http://www.google.com", link_text: "google" },
		 { name: "Meal 6", category: "Food Type 4", comments: "comment 6", rating: "4 of 10", link: "http://www.bing.com", link_text: "bing" },
		 { name: "Meal 7", category: "Food Type 5", comments: "comment 7", rating: "1 of 10", link: "http://www.espn.com", link_text: "espn" },
		 { name: "Meal 8", category: "Food Type 1", comments: "comment 8", rating: "7 of 10", link: "http://www.food.com", link_text: "food"}  
	]);
	
	    // Data
	    //categories = _.uniq(_.pluck(recipesArray, 'category'));
	    //categories = _.uniq([ 'test 1', 'test 2', 'test 3', 'test 1']);
	    self.recipes = ko.observableArray([]);
	    self.newRecipe = ko.observable();
			
		self.addMeal = function() {
	        self.recipesArray.push(new Recipe({ name: this.addname(), category: this.addcategory(), comments: this.addcomments() }));
	        self.addname("");
	    };
		self.removeMeal = function(meal) { self.recipesArray.remove(meal) };
	
	}
	
	ko.applyBindings(new RecipeViewModel());

});





