Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound', // note: only relates to routes with data. All others handled with the catch-all below.
  loadingTemplate: 'loading'
});

Router.map(function() {
	var setPageTitle = function () {
	    var title = 'Prowlr';
	    _.each(arguments, function (v, k) {
	      title.push(v);
	    });
	    document.title = title.join('::');
	  };
	  // home page
	  this.route('home', {
  			path: '/'
	  });

	  // about page
	  this.route('about', {
  			path: '/about'
	  });
});