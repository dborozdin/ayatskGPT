	 // переход к списку ФИ
    function gotoFIList( next ) {
		console.log('gotoFIList');
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html", {
            transition: "slide"
        });
    }
	 // переход к списку компонентов
	 function gotoComponentsList( next ) {
		 console.log('gotoComponentsList');
		 $( ":mobile-pagecontainer" ).pagecontainer( "change", "components_list.html", {
			 transition: "slide"
		 });
	 }
	 // переход к списку неисправностей
    function gotoFailuresList( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "failures_list.html", {
            transition: "slide"
        });
    }
	 // переход к вновь созданному отказу
    function gotoNewFailure( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "failure.html", {
            transition: "slide"
        });
    }

	function goToConnectPage(noTransition)
	{
		var transitionType= "slide";
		if(noTransition==true)
		{
			transitionType= "none";
		}
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "connect.html", {
            	transition: transitionType
        	});
	}
	
	    // переход по свайпу зависит от тек. страницы
	/*
    $( document ).on( "swipeleft", ".ui-page", function( event ) {

		if(!is_touch_device())
		{
			return;
		}
		if(currentPageId=='fiProps' || currentPageId=='fiFailureList' || currentPageId=='connectDB')
		{
			if(currentPageId=='connectDB' && authorizationToken==undefined)
			{
				return;
			}
			gotoFIList();
		}
		else if(currentPageId=='failureProps')
		{
			gotoFailuresList();
		}
    });
	*/
    // переход по свайпу зависит от тек. страницы
	/*
    $( document ).on( "swiperight", ".ui-page", function( event ) {
		if(!is_touch_device())
		{
			return;
		}
		if(currentPageId=='fiProps' || currentPageId=='fiFailureList' || currentPageId=='connectDB')
		{
			if(currentPageId=='connectDB' && authorizationToken==undefined)
			{
				return;
			}
			gotoFIList();
		}
		else if(currentPageId=='failureProps')
		{
			gotoFailuresList();
		}
    });*/