function APL_js_API_business_logic(api) {
	this.api= api;
	this.componentsListQueryCnt=0;
	var self= this;
	getBL= function() {
		return self;
	};
	
	this.getFinalItemTypesList= function(callbackOnSuccess, callbackOnFail) {
		console.log('APL_js_API getFinalItemTypesList');
		console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
		$.ajax({
		  type: "POST",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/query",
		  data:"SELECT Ext FROM	Ext {apl_lss3_component.class->apl_classifier_level.id='1'} END_SELECT",
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.getFailuresList= function(fiId, callbackOnSuccess, callbackOnFail) {
		console.log('APL_js_API getFailuresList');
		console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
		$.ajax({
		  type: "GET",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/find/ent=lss_refusal/planer="+fiId,
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
		
	};
	this.findFailureByActNumber= function(actNumber, callbackOnSuccess, callbackOnFail) {
		console.log('findFailureByActNumber');
		$.ajax({
		  type: "POST",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/query",
		  data:"SELECT Ext FROM	Ext {lss_refusal.act_number='"+ actNumber+"'} END_SELECT",
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.saveFailureChanges= function(failureId, 
									  failureTmpId,
									  act_number, 
									  date_detected,
									  description,
									  satisfation_id,
									  satisfation_date,
									  finalItemId,
									  failedComponentId,
									  callbackOnSuccess,
									  callbackOnFail) {
		console.log('APL_js_API getFinalItemsList');
		var failure_number_id=0;
		if(failureId!=undefined)
		{
			failure_number_id= failureId;
		}
		var failureAttributesData2Save=	{
			"format": "apl_json_1",
			"dictionary": "apl_pss_a",
			"instances":
				[
					{
						"id": failure_number_id, 
						"type": "lss_refusal",
						"attributes": 
						{
							"id": act_number,
							"act_number": act_number,
							"date_detected": date_detected,
							"description": description,
							"satisfation_id": satisfation_id,
							"satisfaction_date": satisfation_date
						}
					}
				]
		};
		if(failureTmpId!= undefined)
		{
			failureAttributesData2Save.instances[0].id_tmp= failureTmpId;
			if(finalItemId!=undefined)
			{
				var finalItem={
					id: finalItemId,
					type: "ils_base_product_instance"
				};
				failureAttributesData2Save.instances[0].attributes.planer=finalItem;
			}
		}
		if(failedComponentId!= undefined)
		{
			var failedComponent={
				id: failedComponentId,
				type: "apl_lss3_component"
			};
			failureAttributesData2Save.instances[0].attributes.item=failedComponent;
		}
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/save",
			data: JSON.stringify(failureAttributesData2Save)
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("Changes saved successfully!");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.error(function( jqXHR, textStatus, errorThrown ){
		  console.log('Save changes returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(callbackOnFail!= undefined)
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
			  else if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		  
		});	
	};
	this.createNewFunction= function( systemSysId,
									  functionLCN,
									  functionName,
									  functionDescription,
									  callbackOnSuccess,
									  callbackOnFail) {
		console.log('APL_js_API createNewFunction');
		var functionLogelAttributesData2Save=	{
			"format": "apl_json_1",
			"dictionary": "apl_pss_a",
			"instances":
				[
					{
						"id_tmp": Math.floor(Math.random() * 1000000),
						"type": "apl_lss3_function_logel_link",
						"attributes":
							{
								"function": {
									"id_tmp": Math.floor(Math.random() * 1000000),
									"type": "apl_lss3_function",
									"attributes":
										{
											"lcn": functionLCN,
											"name_rus": functionName,
											"descr_rus": functionDescription,
										},
								},
								"logel": {
									"id": systemSysId,
									"type": "apl_lss3_component",
								}
							}
					}
				]
		};
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/save",
			data: JSON.stringify(functionLogelAttributesData2Save)
		})
			.done(function( data, textStatus, jqXHR ) {
				console.log("Changes saved successfully!");
				if(callbackOnSuccess!= undefined)
				{
					callbackOnSuccess(data, textStatus, jqXHR);
				}
			})
			.error(function( jqXHR, textStatus, errorThrown ){
				console.log('Save changes returned error:'+ textStatus);
				console.log('errorThrown:'+ errorThrown);
				if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
				{
					if(callbackOnFail!= undefined)
					{
						callbackOnFail(jqXHR, textStatus, errorThrown);
					}
					else if(jqXHR.responseJSON.error_description.length>0)
					{
						var error_description= jqXHR.responseJSON.error_description[0];
						console.log('error description:' + error_description);
						alert(error_description);

					}
				}

			});
	};
	function b64toBlob(b64Data, contentType, sliceSize) {
	  contentType = contentType || '';
	  sliceSize = sliceSize || 512;

	  var byteCharacters = atob(b64Data);
	  var byteArrays = [];

	  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
		  byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	  }
		
	  var blob = new Blob(byteArrays, {type: contentType});
	  return blob;
	}
	
	var a_table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
	var b_table = a_table.split(' ').map(function(s){ return parseInt(s,16) });
	function b_crc32 (str) {
		var crc = -1;
		for(var i=0, iTop=str.length; i<iTop; i++) {
			crc = ( crc >>> 8 ) ^ b_table[( crc ^ str.charCodeAt( i ) ) & 0xFF];
		}
		return (crc ^ (-1)) >>> 0;
	};
	
	this.createDocReferences= function(failureId, failureDocId, base64filesList, callbackOnSuccess, callbackOnFail)
	{
		console.log('APL_js_API createDocReferences');
		var formData = new FormData();	
		var docRefAttributesData2Save=	{
			"format": "apl_json_1",
			"dictionary": "apl_pss_a",
			"instances":[]
		};
		var idTmp=0;
		for(var i=0; i!= base64filesList.length; i++)
		{
			var docRefTmpId= idTmp;
			var assDocTmpId= idTmp+1;
			var assDocUserId= failureDocId+ "-"+(i+1);
			var assDocActiveTmpId= idTmp+2;
			var storedDocTmpId= idTmp+3;
			var blobId= 'blob'+(i+1);
			var currentDate= convertDateToDb(new Date());
			//обрезаем заголовок
			var bData= base64filesList[i].base64data;
			if(bData==undefined)
			{
				console.log("для файла "+base64filesList[i].name+" не задано свойство base64data");
				continue;
			}
			var indComma= base64filesList[i].base64data.indexOf(',');
			if(indComma>0 && indComma<base64filesList[i].base64data.length)
			{
				bData= base64filesList[i].base64data.substr(indComma+1);
			}
			var blob = b64toBlob(bData);
			var crc32= b_crc32(bData);
			
			formData.append(blobId, blob);
			var docRefData= {
				"id_tmp": docRefTmpId,
				"type": "apl_document_reference",
				"attributes": 
				{
					"item": 
					{
						"id": failureId,
						"type": "lss_refusal"
					},
					"type": "relation",
					"assigned_document":
					{
						"id_tmp": assDocTmpId,
						"type": "apl_document",
						"attributes": 
						{
							"id": assDocUserId,
							"active":
							{
								"id_tmp": assDocActiveTmpId,
								"type": "apl_digital_document",
								"attributes": 
								{
									"revision_id": "0", 
									"user": this.api.currentUserName,
									"src_date": currentDate,
									"crc": crc32, 
									"of_document": 
									{
										"id_tmp": assDocTmpId,
										"type": "apl_document",
									},
									"access_form":
									{
										"id_tmp": storedDocTmpId,
										"type": "apl_stored_document",
										"attributes": 
										{
											"file_name": base64filesList[i].name,
											"source": blobId
										}
									}
								}
							}
						}
					}
				}
			};
			docRefAttributesData2Save.instances[i]= docRefData;
			idTmp= storedDocTmpId+1;
		}
		formData.append('json', JSON.stringify(docRefAttributesData2Save));
		
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/upload",
			contentType: false,
			processData: false,
			data: formData
	
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("Changes saved successfully!");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.error(function( jqXHR, textStatus, errorThrown ){
		  console.log('Save changes returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(callbackOnFail!= undefined)
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
			  else if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		  
		});	
	}
	
	this.uploadBlobs= function(failureId, filesList, callbackOnSuccess, callbackOnFail)
	{
		var formData = new FormData();		
		var blobData2Send=	{
			"format": "apl_json_1",
			"dictionary": "apl_pss_a",
			"instances":[]
		};
		for(var i=0; i!= filesList.length; i++)
		{
			formData.append('blob'+(i+1), filesList[i], filesList[i].name);
			var fileData= { "id_tmp": i, 
							"type": "apl_stored_document",
							"attributes": 
							{
								"file_name": filesList[i].name,
								"source": 'blob'+(i+1)
							}
						  };
			blobData2Send.instances[i]= fileData;

		}


		formData.append('json', JSON.stringify(blobData2Send));
		
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/upload",
			contentType: false,
			processData: false,
			data: formData
	
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("Changes saved successfully!");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.error(function( jqXHR, textStatus, errorThrown ){
		  console.log('Save changes returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(callbackOnFail!= undefined)
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
			  else if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		  
		});	
	};
	this.findAssociatedDocumentReferences= function(failureId, callbackOnSuccess, callbackOnFail) {
		console.log('findAssociatedDocs');
		var queryString= "SELECT Ext FROM Ext {apl_document_reference.item=#"+ failureId+"} END_SELECT";
		$.ajax({
		  type: "POST",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/query",
		  data: queryString,
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.getIdArray2DeleteForDocumentReference= function(docRef)	{
		console.log('getIdArray2DeleteForDocumentReference:', docRef);
		var instances2Delete=[];
		instances2Delete.push(docRef.id);
		if(docRef.attributes!= undefined && docRef.attributes.assigned_document!= undefined)
		{
			var aplDoc= docRef.attributes.assigned_document;
			instances2Delete.push(aplDoc.id);
			if(aplDoc!= undefined && aplDoc.attributes!= undefined)
			{
				var aplDocVer= aplDoc.attributes.active;
				instances2Delete.push(aplDocVer.id);
				if(aplDocVer!= undefined && aplDocVer.attributes!= undefined)
				{
					var storedDoc= aplDocVer.attributes.access_form;
					instances2Delete.push(storedDoc.id);
					if(storedDoc!= undefined && storedDoc.attributes!= undefined)
					{
						var blobId= storedDoc.attributes.source;
						if(blobId!= undefined)
						{
							//TODO - добавляем в массив id блоба?
						}
					}
				}
			}
		}
		return instances2Delete;
	}
	
	this.deleteAssociatedDocuments= function(failureId, callbackOnSuccess, callbackOnFail) {
		console.log('findAssociatedDocs');
		getBL().findAssociatedDocumentReferences(failureId, function(docRefArr){
				if(docRefArr!= undefined && docRefArr.instances!= undefined)
				{
					var docRefIds=[];
					for(var i=0; i!= docRefArr.instances.length; i++)
					{
						docRefIds.push(docRefArr.instances[i].id);
					}
					if(docRefIds.length>0)
					{
						getBL().loadDocumentReferencesData(docRefIds, function(docRefArrLoaded){
								var inst2DeleteArr= [];
								for(var i=0; i!= docRefArrLoaded.instances.length; i++)
								{
									var docRefInst2DeleteArr= getBL().getIdArray2DeleteForDocumentReference(docRefArrLoaded.instances[i]);
									inst2DeleteArr= inst2DeleteArr.concat(docRefInst2DeleteArr);
								}
								if(inst2DeleteArr.length>0)
								{
									getBL().api.deleteInstancesArray(inst2DeleteArr, callbackOnSuccess, callbackOnFail);
								}
								else
								{
									if(callbackOnSuccess!=undefined)
									{
										callbackOnSuccess();
									}
								}
						}, callbackOnFail);
					}
					else
					{
						callbackOnSuccess();
					}
				}
				else
				{
					callbackOnSuccess();
				}

			}, callbackOnFail);
	}
	this.loadDocumentReferencesData= function(docRefIds, callbackOnSuccess, callbackOnFail) {
		console.log('loadDocumentReferencesData');
		if(docRefIds==undefined || docRefIds.length<1)
		{
			console.log('docRefIds list is empty!');
			return;
		}
		var queryString="/t=a&id=";
		for(var i=0; i!= docRefIds.length; i++)
		{
			if(i>0)
			{
				queryString+=",";
			}
			queryString+= docRefIds[i];
		}
		queryString+= "/t=d&id=0&attr=assigned_document/t=d&id=1&attr=active/t=d&id=2&attr=access_form";
		$.ajax({
		  type: "GET",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/load"+queryString,
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.loadBlob= function(storedDocId, filename, callbackOnSuccess, callbackOnFail, docReferenceData) {
		console.log('loadBlob');
		queryString= "/getblob&enc=b64/id="+storedDocId+"&attr=source";
		if(filename!= undefined)
		{
			queryString+= "/"+ filename;
		}
		$.ajax({
		  type: "GET",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  responseType: "blob",
		  url: getBL().api.getConnectionUrl()+"/rest"+queryString,
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(storedDocId, filename, data, docReferenceData);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.loadComponentsData= function(componentIds, callbackOnSuccess, callbackOnFail, attrs2load) {
		console.log('loadComponentsData');
		if(componentIds==undefined || componentIds.length<1)
		{
			console.log('componentIds list is empty!');
			return;
		}
		var queryString="/t=a&id=";
		for(var i=0; i!= componentIds.length; i++)
		{
			if(i>0)
			{
				queryString+=",";
			}
			queryString+= componentIds[i];
		}
		if(attrs2load!=undefined)
		{
			queryString+=attrs2load;
		}
		$.ajax({
		  type: "GET",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/load"+queryString,
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				  callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.getChildComponentsList= function(prevQueryResponse, callbackOnSuccess, callbackOnFail, id2Find, recursive=true) {

		console.log('getChildComponentsList')
		console.log('recursive:', recursive)
		if(prevQueryResponse==undefined || prevQueryResponse.instances==undefined)
		{
			return;
		}
		
		var query= "SELECT Ext FROM	Ext {apl_lss3_logistic_element(";
		var componentsList=[];
		var componentsListIds=[];
		for(var i=0; i!=prevQueryResponse.instances.length;i++)
		{
			if(i>0)
			{
				query+=" OR ";
			}
			if(prevQueryResponse.instances[i].attributes.element_type== "system")//пришла дочерняя система
			{
				query+=".parent_element=#"+prevQueryResponse.instances[i].id;
			}
			else//пришла связь между элементами
			{
				if(prevQueryResponse.instances[i].attributes.child_component!= undefined)
				{
					var childComponent= prevQueryResponse.instances[i].attributes.child_component;
					var compId= childComponent.id;					
					componentsListIds.push(compId);
					query+=".parent_component=#"+compId;

				}
			}
		}
		query+=")} END_SELECT";
		
		if(componentsListIds.length>0)//загрузка атрибутов
		{
			var attrsQuery2load= "&all_attrs=false/t=d&id=0&attr=id/t=d&id=0&attr=name_rus";
			getBL().componentsListQueryCnt++;
			getBL().loadComponentsData(componentsListIds, function(data) {
				if(data!= undefined && data.instances!= undefined)
				{
					for(var i=0; i!= data.instances.length; i++)
					{
						var compData= data.instances[i];
						if(id2Find!=undefined)
						{
							var compHumanId= compData.attributes.id;
							var compName= compData.attributes.name_rus;
							var re = new RegExp(id2Find, 'gi');
							if(compHumanId.match(re)!=null || compName.match(re)!=null)
							{
								componentsList.push(compData);
							}
						}
						else
						{
							componentsList.push(compData);
						}
					}
					if(callbackOnSuccess!=undefined)
					{
						callbackOnSuccess(componentsList);
					}
				}
			}, callbackOnFail, attrsQuery2load);
		}
		if(recursive==true)
		{
			console.log('APL_js_API getComponentsList');
			console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
			getBL().componentsListQueryCnt++;
			$.ajax({
				type: "POST",
				beforeSend: function(request) {
					request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
				},
				url: getBL().api.getConnectionUrl()+"/rest/query",
				data: query,
				success: function(data) {
					console.log('getChildComponentsList success:',data);
					getBL().getChildComponentsList(data, callbackOnSuccess, callbackOnFail, id2Find);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					if(callbackOnFail!= undefined)
					{
						callbackOnFail(jqXHR, textStatus, errorThrown);
					}
				}
			});
		}
	};

	this.getComponentsList= function(fiId, callbackOnSuccess, callbackOnFail, id2Find) {

		console.log('APL_js_API getComponentsList');
		console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
		var query= "SELECT Ext FROM	Ext {apl_lss3_logistic_element.parent_component=#"+fiId+" } END_SELECT";
		getBL().componentsListQueryCnt=1;
		$.ajax({
		  type: "POST",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
		  },
		  url: getBL().api.getConnectionUrl()+"/rest/query",
		  dataType: 'json',
		  data: query,
		  complete: function(jqXHR, textStatus) {
			  console.log('getComponentsList root query complete.TextStatus:',textStatus);
		  },
		  success: function(data) {
			  console.log('getComponentsList root query success');
			  getBL().getChildComponentsList(data, function(componentsList){
				  if(callbackOnSuccess!=undefined)
				  {
					  callbackOnSuccess(componentsList, getBL().componentsListQueryCnt);
				  }
				}, callbackOnFail, id2Find);
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnFail!= undefined)		  
			  {
				  callbackOnFail(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.getSystemsList= function(fiId, callbackOnSuccess, callbackOnFail, id2Find) {

		console.log('APL_js_API getSystemsList');
		console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
		var query= "SELECT Ext FROM	Ext {apl_lss3_logistic_element.parent_component=#"+fiId+" } END_SELECT";
		getBL().componentsListQueryCnt=1;
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/query",
			dataType: 'json',
			data: query,
			complete: function(jqXHR, textStatus) {
				console.log('getComponentsList root query complete.TextStatus:',textStatus);
			},
			success: function(data) {
				console.log('getComponentsList root query success');
				getBL().getChildComponentsList(data, function(componentsList){
					if(callbackOnSuccess!=undefined)
					{
						console.log('child system components data:', data);
						//callbackOnSuccess(componentsList, getBL().componentsListQueryCnt);
						callbackOnSuccess(data, componentsList);
					}
				}, callbackOnFail, id2Find, false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if(callbackOnFail!= undefined)
				{
					callbackOnFail(jqXHR, textStatus, errorThrown);
				}
			}
		});
	};

	this.getFunctionsList= function(componentRelationId, componentId, callbackOnSuccess, callbackOnFail, id2Find) {

		console.log('APL_js_API getFunctionsList');
		console.log('componentRelationId:',componentRelationId);
		console.log('APL_js_API_obj.authorizationToken:'+ getBL().api.authorizationToken);
		var query= "SELECT Ext FROM	Ext {apl_lss3_function_logel_link(.logel= #"+ componentRelationId +" OR .logel= #"+ componentId +")}.function END_SELECT";
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-APL-SessionKey", getBL().api.authorizationToken);
			},
			url: getBL().api.getConnectionUrl()+"/rest/query",
			dataType: 'json',
			data: query,
			complete: function(jqXHR, textStatus) {
				console.log('getFunctionsList query complete.TextStatus:',textStatus);
			},
			success: function(data) {
				console.log('getFunctionsList query success');
				if(callbackOnSuccess!=undefined)
				{
					console.log('functions data:', data);
					callbackOnSuccess(data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if(callbackOnFail!= undefined)
				{
					callbackOnFail(jqXHR, textStatus, errorThrown);
				}
			}
		});
	};

}
