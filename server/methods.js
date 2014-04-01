if (Meteor.isServer) {


  Articles = new Meteor.Collection("articles");

 Meteor.methods({
        getFlickrPhotos: function(page) {
            console.log("server side:::::get next page" + page);

            var pageFirstTime = 1;

            var apiKey = "9f0bc25986f274a4383457652dd072a2";
            var userID = "80376997@N00";
            var getResult = null;
            var radius = 5; // in km
            var tags = "san diego";
            var perpage = 10;
            //var page = 1;

            //"&page="+ page+ "
            var url = "http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=" + apiKey + "&user_id=" + userID + "&page="+ page+ "&per_page=" + perpage + "&format=json&nojsoncallback=1";

            var result = Meteor.http.call("GET", url);

           console.log("getFlickrPhotos: GET request:::" + url);

            var jsonResult = JSON.parse(result.content);
         
                //LOOP THROUGH DATA
                         _.each(jsonResult.photos.photo,  function(item){
                           
                         // console.log("holy shit "  + photo.title._content);
                         // if item id exists in db, dont add it.
                         Articles.insert({
                                id: item.id,
                                title: item.title,
                                secret: item.secret,
                                server: item.server,
                                farm: item.farm,
                                timestamp: Date.now()
                                //text: i + ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.',
                                //color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)

                         }, function(err, id) {
                                if(err) {
                                    console.log("error saving.....");

                                }

                        });
            });
        },

       
    });


    Meteor.publish('articles_paginated', function(params) {

            var pageLimit = 10;

            var start = params.page * pageLimit;

             
            console.log('START:', start);
            // if the start value is greater than the length, load from api into db, the return
            return Articles.find({}, {skip:start, limit: pageLimit});
        });


    Meteor.startup(function () {

       // default page to 1 for first time.
       var pageFirstTime = 1;


       var apiKey = "9f0bc25986f274a4383457652dd072a2";
            var userID = "80376997@N00";
            var getResult = null;
            var radius = 5; // in km
            var tags = "san diego";
            var perpage = 500;
            var page = 1;

            //"&page="+ page+ "
            var url = "http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=" + apiKey + "&user_id=" + userID + "&per_page=" + perpage + "&format=json&nojsoncallback=1";

            var result = Meteor.http.call("GET", url);

            console.log("GET request:::" + url);

            var jsonResult = JSON.parse(result.content);

             console.log("we found: " + jsonResult.photos.photo.length);

            
                         _.each(jsonResult.photos.photo,  function(item){
                         
                            // TODO -add a check to not insert an article that already exists.   
                            Articles.insert({
                                id: item.id,
                                title: item.title,
                                secret: item.secret,
                                server: item.server,
                                farm: item.farm,
                                timestamp: Date.now()

                         }, function(err, id) {
                                if(err) {
                                    console.log("error saving.....");

                                }

                        });
            });
                      

        

        /**
         * Manually triggered mongodb document changes can be catched serverside
         * and send down the wire with something like meteor-streams
         */
        Articles.find().observe({
            added: function(doc) {
                //console.log('doc added::' + doc.id);
            },
            removed: function(oldDoc) {
                console.log('doc removed');
            }
        });

  });
}






