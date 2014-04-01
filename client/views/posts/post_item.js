Template.postItem.helpers({
	 image: function() {
		 //var img = document.createElement('img');
		 var src = "http://farm" + this.farm + ".staticflickr.com/" + this.server + "/" + this.id+"_"+ this.secret + "_m.jpg";
		 return src;
 	 }
});


//http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg