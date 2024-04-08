	var clickedComponent;
	var clickedComponentId;
	var clickedComponentRelation;
	function drawComponent(compList, data, relation_data)
	{
		if(data==undefined || data.attributes==undefined)
		{
			return;
		}
		var componentId= GetFormattedAttrValue(data.attributes.id);
		var componentName= GetFormattedAttrValue(data.attributes.name_rus);
			
		console.log('componentId: '+ componentId);
		console.log('componentName: '+ componentName);
		
		var rowId= "CmRow"+ relation_data.id;
		var htmlAppendRow = document.createElement("tr");
			htmlAppendRow.setAttribute("id", rowId);
			//htmlAppendRow.dataset.ComponentObj= data;
		var htmlAppendComponentId= document.createElement("td");
			htmlAppendComponentId.innerHTML=componentId;
			htmlAppendRow.appendChild(htmlAppendComponentId); 
		var htmlAppendComponentName= document.createElement("td");
			htmlAppendComponentName.innerHTML= "<a id='cmpName"+ data.id+"' href='component.html' onclick='OnComponentProps(this)'>"+componentName+"</a>";
			htmlAppendRow.appendChild(htmlAppendComponentName);
		var htmlAppendComponentShowFunctions= document.createElement("td");
			htmlAppendComponentShowFunctions.innerHTML= "<div class='btnLarge'><a id='cmpRel"+ relation_data.id+"' href='functions_list.html' class='ui-btn ui-icon-grid ui-corner-all ui-btn-icon-left sm_btnText' onclick='OnComponentProps(this)'>Показать</a></div>";
			htmlAppendRow.appendChild(htmlAppendComponentShowFunctions);



		compList.appendChild(htmlAppendRow);
		$( "#"+rowId ).data( "ComponentObjRel", relation_data );
		$( "#cmpRel"+relation_data.id ).data( "ComponentObjRel", relation_data );
		$( "#cmpName"+data.id ).data( "ComponentObj", data );

		var CompData= $( "#cmpName"+data.id ).data( "ComponentObj");
		console.log('Component data: '+ "#cmpName"+data.id, data);
		var CompRelData= $( "#cmpRel"+relation_data.id ).data( "ComponentObjRel");
		console.log('Component rel data: '+ "#cmpRel"+relation_data.id, relation_data);
		
		
	}
	
	
	function UpdateComponentsListTable(relationData, componentsData)
	{
		console.log('UpdateComponentsListTable');

		var compList= document.getElementById("componentsList");
		var childNodes;
		if(compList!=undefined)		
		{
			childNodes= compList.childNodes;
		}
		if(relationData!= undefined &&
			relationData.instances!= undefined &&
			componentsData!= undefined)
		{
			console.log('relationData:', relationData);
			console.log('componentsData:', componentsData);
			for(var i=0; i!= relationData.instances.length; i++)
			{
				var relationInstance= relationData.instances[i];
				var component_id= relationData.instances[i].attributes.child_component.id;
				for(var j=0; j!= componentsData.length; j++)
				{
					if(componentsData[j].id==component_id)
					{
						var componentInstance= componentsData[j];
						relationInstance.component= componentInstance;
						var newCompId= componentInstance.attributes.id;
						console.log('add ' + i +  ' instance with id:'+componentInstance.id);
						drawComponent(compList, componentInstance, relationInstance);
						break;
					}
				}

			}
			$("#componentsListUpdateStatus").text("");
		}

		$("#refreshComponentsList").attr("disabled", false);
		hideDisableLayer();
		$('#componentsList').hide().show(0);

		
	}

	function UpdateComponentsList()
	{
		console.log('UpdateComponentsList')
		if(clickedFI==undefined || clickedFI.attributes==undefined )
		{
			return;
		}
		console.log('clickedFI:', clickedFI)
		//загрузка перечня компонентов для ФИ
		var fiId= clickedFI.attributes.id;
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
		$("#refreshComponentsList").attr("disabled", true);
		$("#componentsList").empty();
		$("#componentsListUpdateStatus").text("Загрузка перечня систем...");
		currentFIComponentsCnt=0;
		aplAPI_BL.getSystemsList(clickedFI.id, UpdateComponentsListTable, onRestError);
		
	}

	function OnComponentProps(firedByElement)
	{
		console.log('OnComponentProps '+ firedByElement);
		clickedComponent= $( "#"+firedByElement.id ).data( "ComponentObj");
		clickedComponentRelation= $( "#"+firedByElement.id ).data( "ComponentObjRel");
		if(clickedComponent!= undefined)
		{
			clickedComponentId= clickedComponent.id;
		}
		else if(clickedComponentRelation!= undefined)
		{
			clickedComponentId= clickedComponentRelation.attributes.child_component.id;
			clickedComponent= clickedComponentRelation.component;
		}
		console.log('ComponentId = #'+firedByElement.id, clickedComponent);
		console.log('ComponentRelId = #'+firedByElement.id, clickedComponentRelation);
		console.log('clickedComponentId:', clickedComponentId);
	}

