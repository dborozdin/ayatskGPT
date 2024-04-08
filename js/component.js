	function doUpdateSingleComponentFields(componentId, componentName)
	{		
		console.log('componentId: '+ componentId);
		console.log('componentName: '+ componentName);
		
		$( "#component_dlg_id").text(componentId);
		$( "#component_dlg_name").text(componentName);
		
		var qrcode = new QRCode("component_dlg_qr", {
									height:200,
									width:200});
	
		function makeCode () {		
		
			if (componentId==undefined) {
				console.log('Обозначение компонента не задано!');
				return;
			}
			qrcode.clear();
			qrcode.makeCode(componentId);
		}

		makeCode();

		$("#component_dlg_qr").
			on("blur", function () {
				makeCode();
			}).
			on("keydown", function (e) {
				if (e.keyCode == 13) {
					makeCode();
				}
			});
		
	}
	function UpdateSingleComponentData()
	{
		console.log('UpdateSingleComponentData:', clickedComponent);
		var data= clickedComponent;
		if(data==undefined)
		{
			return;
		}
		var componentId;
		var componentName;
		
		if(data.attributes==undefined)
		{
			console.log('С компонентом '+ data.id+ ' что-то не так (атрибут attributes не задан)' );
			return;
		}
		componentId= GetFormattedAttrValue(data.attributes.id);
		componentName= GetFormattedAttrValue(data.attributes.name_rus);
		
		doUpdateSingleComponentFields(componentId, componentName);
	}
	function gotoComponentsList()
	{
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "components_list.html", {
            	transition: "slide"
        	});
	}
	

	

	