
persistence.store.websql.config(persistence,'w4dinner', 'meals for dinner', 5 * 1024 * 1024);



var Meal = persistence.define('Meal', {
	name: 'VARCHAR',
	category: 'VARCHAR',
	comments: 'VARCHAR',
	rating: 'INTEGER',
	link: 'TEXT',
	linkText: 'VARCHAR'
});

function saveToDB(){
	//write schema
	persistence.schemaSync(function(){
		
	
		var name = $('#name').val();
		var category = $('#category').val();
		var comment = $('#comments').val();
		var rating = $('#rating').val();
		var link = $('#link').val();
		var meal = new Meal({ name: name, category: category, comments: comment, rating: rating, link: link, linkText: linkText });
		persistence.add(meal);
		
		 //commit dummy tasks to database
		 persistence.flush(function(){
		
		  //retrieve all tasks from database
		  Meal.all().list(function(meals){
		   //callback counter
		   var mealCounter = meal.length;
		
		   //asynchronously loop through items
		   meals.forEach(function(meals){
		     //randomly set items to done
		     meals.done = Math.round(Math.random());
		     console.log('meal test: ' + meals);
		     //decrement callback counter
		     //check if this is last run
		     if(--mealCounter == 0){
		
		      //write all changes back to database
		      persistence.flush(function(){
		
		      //call destroyAll on a collection with the filter done=true
		      Meals.all().filter('done','=',true).destroyAll();
		     });
		    }
		   });
		  });
		 });
		});
};

var allMeals = Meal.all().list(null, function (results) {
    results.forEach(function (t) {
        //console.log('[' + t.name + '] '+ t.name);          
    });
});
console.log(results);
//------------------------ knockout functions ----------- //
(function($){

	
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
	    this.mealsArray = ko.observableArray(allMeals);
			
//	this.recipesArray = ko.observableArray([
//	     { name: "Meal1", category: "Food Type 1", comments: "comment 1", rating: "7 of 10", link: "http://www.google.com", link_text: "google" },
//		 { name: "Meal 2", category: "Food Type 2", comments: "comment 2", rating: "2 of 10", link: "http://www.recipes.com", link_text: "recipes" },
//		 { name: "Meal 3", category: "Food Type 1", comments: "comment 3", rating: "5 of 10", link: "http://www.pauladean.com", link_text: "paula dean" },
//	     { name: "Meal 4", category: "Food Type 2", comments: "comment 4", rating: "9 of 10", link: "http://www.google.com", link_text: "google" },
//		 { name: "Meal 5", category: "Food Type 3", comments: "comment 5", rating: "10 of 10", link: "http://www.google.com", link_text: "google" },
//		 { name: "Meal 6", category: "Food Type 4", comments: "comment 6", rating: "4 of 10", link: "http://www.bing.com", link_text: "bing" },
//		 { name: "Meal 7", category: "Food Type 5", comments: "comment 7", rating: "1 of 10", link: "http://www.espn.com", link_text: "espn" },
//		 { name: "Meal 8", category: "Food Type 1", comments: "comment 8", rating: "7 of 10", link: "http://www.food.com", link_text: "food"}  
//	]);
	
	    // Data
	    //categories = _.uniq(_.pluck(recipesArray, 'category'));
	    //categories = _.uniq([ 'test 1', 'test 2', 'test 3', 'test 1']);
			
		self.addMeal = function() {
	        self.recipesArray.push(new Recipe({ name: this.addname(), category: this.addcategory(), comments: this.addcomments() }));
	        self.addname("");
	    };
		self.removeMeal = function(meal) { self.recipesArray.remove(meal) };
	
	}
	
	ko.applyBindings(new RecipeViewModel());

});


