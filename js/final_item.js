	function UpdateSingleFIData()
	{
		console.log('UpdateSingleFIData:'+ clickedFI);
		if(clickedFI==undefined || clickedFI.attributes==undefined)
		{
			return;
		}
		var fi_id= GetFormattedAttrValue(clickedFI.attributes.id);
		var fi_name= GetFormattedAttrValue(clickedFI.attributes.name_rus);
		console.log('fi_id:'+fi_id);
		console.log('fi_name:'+fi_name);
		$( "#fi_dlg_id").text(fi_id);
		$( "#fi_dlg_name").text(fi_name);
		
	}