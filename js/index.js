	var finalItems;
	var connectData;
	var currentServer;
	var currentPort;
	var authorizationToken;
	var chosenFIName;
	var chosenFIName;
	var clickedFI;
	var clickedFailure;
	var currentPageId;
	var aplAPICore;
	var aplAPI_BL;
	var newFailuresCnt=0;
	var currentFIFailuresCnt=0;

	function getFinalItemTypesList()
	{
		console.log('getFinalItemTypesList');
		if(aplAPI_BL==undefined)
		{
			if(aplAPICore==undefined)
			{
				console.log('aplAPICore is undefined!');
				return;
			}
			aplAPI_BL= new APL_js_API_business_logic(aplAPICore);
		}
		showDisableLayer();
		$("#refreshFIList").attr("disabled", false);
		aplAPI_BL.getFinalItemTypesList(updateFinalItemsList, onRestError);

	}
	function drawFinalItem(data)
	{
		console.log('drawFinalItem')
		if(data==undefined || data.attributes==undefined)
		{
			return;
		}
		console.log('data:',data);
		var fi_id= GetFormattedAttrValue(data.attributes.id);
		var fi_name= GetFormattedAttrValue(data.attributes.name_rus);

		console.log('fi_id: '+ fi_id);
		console.log('fi_name: '+ fi_name);

		var tableRow= document.createElement("div");
		tableRow.className="table_row";
		tableRow.id= "finalItemsListRow"+data.id;

		var htmlAppendId= document.createElement("div");
		htmlAppendId.className= "table_row_cell table_row_cell_id";
		htmlAppendId.innerHTML= "<a id='FIId"+ data.id+"' href='final_item.html' onclick='OnFIProps(this)'>"+ fi_id+"</a>";
		tableRow.appendChild(htmlAppendId);

		var htmlAppendName= document.createElement("div");
		htmlAppendName.className= "table_row_cell table_row_cell_name";
		htmlAppendName.id= "FINm"+data.id;
		htmlAppendName.innerHTML= fi_name;
		tableRow.appendChild(htmlAppendName);

		var htmlAppendComponents= document.createElement("div");
		htmlAppendComponents.className= "table_row_cell table_row_cell_button";
		htmlAppendComponents.innerHTML= "<div class='btnLarge'><a id='FICs"+ data.id+"' href='components_list.html' class='ui-btn ui-icon-grid ui-corner-all ui-btn-icon-left sm_btnText' onclick='OnFIProps(this)'>Выбрать</a></div>";
		//<!--<div className='btnSmall'><a id='FICs"+ data.id+"' href='components_list.html' className='ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all' onClick='OnFIProps(this)'></a></div>-->
		tableRow.appendChild(htmlAppendComponents);

		//var htmlAppendFailures= document.createElement("div");
		//htmlAppendFailures.className= "table_row_cell table_row_cell_button";
		//htmlAppendFailures.innerHTML= "<div class='btnLarge'><a id='FIFs"+ data.id+"' href='failures_list.html' class='ui-btn ui-icon-alert ui-corner-all ui-btn-icon-left sm_btnText' onclick='OnFIProps(this)'>Неисправности</a></div><div class='btnSmall'><a id='FIFs"+ data.id+"' href='failures_list.html' class='ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all' onclick='OnFIProps(this)'></a></div>";
		//tableRow.appendChild(htmlAppendFailures);

		var finalItemsList= document.getElementById("finalItemsList");
		console.log('finalItemsList:', finalItemsList);
		finalItemsList.appendChild(tableRow);

		$('#'+tableRow.id).trigger("create");
		$('#'+tableRow.id).show();
		$('#finalItemsList').trigger("create");
		$('#finalItemsList').show();
		$('#mainDiv').trigger("create");

		$( "#FIId"+data.id ).data( "FIobj", data );
		$( "#FINm"+data.id ).data( "FIobj", data );
		$( "#FICs"+data.id ).data( "FIobj", data );
		//$( "#FIFs"+data.id ).data( "FIobj", data );

		var FINmData= $( "#FINm"+data.id ).data( "FIobj");
		console.log('FINm data: '+ "#FINm"+data.id+" value:"+ FINmData);
	}
	function updateFinalItemsList(data)
	{
		console.log('get fi list returned:', data);
		$("#finalItemsList").empty();
		if(data.instances==undefined)
		{
			hideDisableLayer();
			$("#refreshFIList").attr("disabled", false);
			return;
		}
		for(var i=0; i!= data.instances.length; i++)
		{
			var fiInstance= data.instances[i];
			console.log('instance '+ i+ fiInstance.id);
			drawFinalItem(fiInstance);
		}
		$("#refreshFIList").attr("disabled", false);
		hideDisableLayer();
		$("#fiList").trigger('create');
	}
	function OnFIProps(firedByElement)
	{
		console.log('OnFIProps !!!');
		console.log('firedByElement:', firedByElement);
		console.log('OnFIProps '+ firedByElement);
		clickedFI= $( "#"+firedByElement.id ).data( "FIobj");
		console.log('FINm = #'+firedByElement.id+" value:"+ clickedFI);
	}
		
	$(document).on("pagecontainerchange", function (event, ui) {
		onPageChange(event, ui);
	});
	
	$(window).bind('beforeunload', function(){
		console.log("beforeunload!");
		if(aplAPICore!=undefined && aplAPICore.authorizationToken!=undefined)
		{
			aplAPICore.disconnect(function(){console.log("disconnect db suссess!")}, onRestError);
		}
	});
	
	function onPageChange(eventDescr, ui)
	{
		var newPageId = ui.toPage[0].id;
		console.dir("onPageChange() newPageId:"+newPageId);
		currentPageId= newPageId;
		console.log("currentPageId:"+ currentPageId);
		if(aplAPICore==undefined || aplAPICore.authorizationToken==undefined)
		{
			if(currentPageId!= 'connectDB')
			{
				goToConnectPage(true);
			}
			else
			{
				history.go(0);
				readConnectionParamsFromCookies();
				UpdateDBList();
			}
			return;
		}
		if(newPageId=='fiList')
		{
			//загрузка перечня ФИ
			getFinalItemTypesList();
		}
		else if(newPageId=='fiProps')
		{
			UpdateSingleFIData();
		}
		else if(newPageId=='fiFailureList')
		{
			UpdateFailuresList();
		}
		else if(newPageId=='failureProps')
		{
			UpdateSingleFailureData();
		}
		else if(newPageId=='connectDB')
		{
			readConnectionParamsFromCookies();
			UpdateDBList();
		}
		else if(newPageId=='failedItemQrReader')
		{
			updateCameraConnection();
		}
		else if(newPageId=='fiComponentsList')
		{
			UpdateComponentsList();
		}
		else if(newPageId=='componentProps')
		{
			UpdateSingleComponentData();
		}
		else if(newPageId=='functionsList')
		{
			readGenerationParamsFromCookies();
			UpdateFunctionsList();
		}

	}
	function enableDisabledButtons()
	{
		$("#refreshFIList").attr("disabled", false);
		$("#refreshFailuresList").attr("disabled", false);
		
	}
	function onRestError(jqXHR, textStatus, errorThrown)
	{
	  var error_description;
	  if(jqXHR!= undefined && jqXHR.responseJSON!= undefined)
	  {
		  error_description= jqXHR.responseJSON.error_description[0];
		  console.log('error description:' + error_description);
	  }
	  hideDisableLayer();
	  enableDisabledButtons();
	  if(errorThrown== "Unauthorized")//истекло время сессии, либо сервер перезапускался за время заполнения формы
	  {
		  alert("Время сессии истекло, необходимо заново подключиться к БД!");
		  goToConnectPage();
		  return;
	  }
	  if(error_description!= undefined && error_description.length>0)
	  {
		 alert(error_description);
	  }
	  else if(jqXHR!= undefined && 
			 (jqXHR.status== 0 || jqXHR.status>500))
	  {
		  alert("Не удалось получить запрошенные данные, проверьте подключение к серверу приложений!");
		  goToConnectPage();
	  }
	}


	

	
   
	