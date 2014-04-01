if (Meteor.isClient) {

	Articles = new Meteor.Collection("articles");

	var masonry;
	var mirrorCollection = {};

	Template.scroll.articles = function () {
		console.log("client::scroll.articles");
		return Articles.find().fetch()
	};


	Template.scroll.count = function() {
		return Session.get("articlePage");
	}

	Template.home.greeting = function() {
		return "Welcome to Prowlr";
	}

	Template.scroll.created = function() {
		console.log("client::scroll.created");
		Session.set("articlePage", 0);

		$(document).off('scroll').on('scroll', function(e) {
			var loadArea = 200;
			var docHeight = $(document).height();
			var windowHeight = $(window).height();
			var scrollTop = $(document).scrollTop();
			var fromBottom = docHeight - windowHeight - scrollTop;
			// Load next set when approaching end of scroll, 
			if(fromBottom < loadArea) {
				Session.set("articlePage", Session.get("articlePage") + 1);
			}
		});
	} 

	/** For now use a custom remove item which removes the item from the dom */
	window.removeArticle = function(_id) {
		Articles.remove({_id: _id}, function(){
			$('#masonry-container').find('#article-'+_id).remove();
			masonry.layout()
		});
	}


	Template.article.helpers({
	 image: function() {
		 //var img = document.createElement('img');
		 var src = "http://farm" + this.farm + ".staticflickr.com/" + this.server + "/" + this.id+"_"+ this.secret + "_m.jpg";
		 return src;
 	 }
	});

	Template.scroll.rendered = function() {
		console.log("rendered");
		var eor = false;
		var container = document.querySelector('#masonry-container');
			masonry = new Masonry( container, {
				columnWidth: 200,
				gutter: 10,
				itemSelector: '.article'
			});

		/**
		 * Track minimongo collection insert
		 * TODO: We can't use removed in observe right now, because subscription skip triggers removed
		 * now on all previous pages. Previous items should be kept and watched in minimongo
		 *
		 */

		 
		var lqHandle = Articles.find().observe({
			added: function(doc) {

				// Not yet rendered 
				if(!(doc._id in mirrorCollection)) {
					mirrorCollection[doc._id] = doc;
					
					//console.log("added::" + doc.secret);

					//var el = $(Template.article(doc));
					 var src = "http://farm" + doc.farm + ".staticflickr.com/" + doc.server + "/" + doc.id+"_"+ doc.secret + "_m.jpg";

					 var htmlFrag = "<div class='article' id='article-" + doc.id + "'><img src='" + src + "'></div>";

					 $(container).append(htmlFrag);
					masonry.appended(htmlFrag);

				}
			}
		});


		this.handle = Deps.autorun(function() {
			if(!eor) {
				Meteor.subscribe("articles_paginated", {page: Session.get("articlePage")}, function() {
					var docHeight = $(document).height();
					var windowHeight = $(window).height();

					
					/**
					 * Trigger new content to flow into masonry, while there is no scrollbar and
					 * there are still new articles
					 */
					var cursor = Articles.find();
					if(docHeight == windowHeight) {
						if(cursor.fetch().length > 0) {
							Session.set("articlePage", Session.get("articlePage") + 1);
							
							
							
						}
						else {
							eor = true;
							Session.set("articlePage",  Session.get("articlePage") - 1);
							
						}
					}
					else if(cursor.fetch() == 0) {
						eor = true;
						Session.set("articlePage", Session.get("articlePage") - 1);

						//we may need more data - the end of the line!!!!
						/* Meteor.call("getFlickrPhotos", Session.get("articlePage"), function(error, result) {
								console.log("client side:::::");
							});
						*/
					}
				});
			}
	  });
  }
}

