function APL_js_API_core() {
	var authorizationToken;
	var currentServer;
	var currentPort;
	var currentUserName;
	var self= this;
	getAPI= function() {
		return self;
	};

	this.getDbListFromServer= function(server, port, callbackOnSuccess, callbackOnError) {
		console.log('APL_js_API getDbListFromServer');
		$.ajax({
		  type: "GET",
		  url: "http://"+server+":"+port+"/rest/dblist",
		  success: function(data) {
			  if(callbackOnSuccess!= undefined)
			  {
				 callbackOnSuccess(data);
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  if(callbackOnError!= undefined)
			  {
				 callbackOnError(jqXHR, textStatus, errorThrown);
			  }
		  }
		});
	};
	this.connect= function(server, port, db, userName, userPassword, callbackOnSuccess, callbackOnError) {
		console.log('APL_js_API connect');
		var connectString= "http://"+server+":"+port+"/rest/connect/user="+userName;
		if(userPassword!= undefined && userPassword!="")
		{
			connectString+= "&pass="+userPassword;
		}
		connectString+="&db="+db;
		console.log("connectString:"+connectString);
		$.ajax({
		  type: "GET",
		  url: connectString,
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("connected to db:"+db);
		  console.log("session_key:"+data.session_key);
		  getAPI().authorizationToken= data.session_key;
		  getAPI().currentServer= server;
		  getAPI().currentPort= port;
		  getAPI().currentUserName= userName;
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.fail(function( jqXHR, textStatus, errorThrown ){
		  console.log('connect returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(callbackOnError!= undefined)
		  {
			  callbackOnError(jqXHR, textStatus, errorThrown);
		  }
		  else if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		  
		});	
	};
	this.getConnectionUrl=function(){
		if(this.currentServer==undefined || this.currentPort==undefined)
		{
			console.log("server or port undefined!");
			return;
		}
		var connectionUrl= "http://"+ this.currentServer+":"+this.currentPort;
		console.log("getConnectionUrl returned:"+ connectionUrl);
		return connectionUrl;
	};
	this.disconnect=function(callbackOnSuccess, callbackOnError){
		console.log('disconnect');
		$.ajax({
		  type: "POST",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getAPI().authorizationToken);
		  },
		  url: getAPI().getConnectionUrl()+"/rest/disconnect",
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("disconnected successfully");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.fail(function( jqXHR, textStatus, errorThrown ){
		  console.log('disconnect returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(callbackOnError!= undefined)
		  {
			  callbackOnError(jqXHR, textStatus, errorThrown);
		  }
		  else if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
 
			  }
		  }
		});
	};
	this.deleteInstance=function(instanceId, callbackOnSuccess, callbackOnError){
		console.log('deleteInstance:'+ instanceId);
		$.ajax({
		  type: "DELETE",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getAPI().authorizationToken);
		  },
		  url: getAPI().getConnectionUrl()+"/rest/"+instanceId,
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("deleted successfully");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.fail(function( jqXHR, textStatus, errorThrown ){
		  console.log('deleteInstance returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(callbackOnError!= undefined)
		  {
			  callbackOnError(jqXHR, textStatus, errorThrown);
		  }
		  else if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		});
	};
	this.deleteInstancesArray=function(instanceIdArray, callbackOnSuccess, callbackOnError){
		console.log('deleteInstancesArray');
		var instanceIdArrString= instanceIdArray.join();
		$.ajax({
		  type: "DELETE",
		  beforeSend: function(request) {
			request.setRequestHeader("X-APL-SessionKey", getAPI().authorizationToken);
		  },
		  url: getAPI().getConnectionUrl()+"/rest/"+instanceIdArrString,
		})
		.done(function( data, textStatus, jqXHR ) {
		  console.log("deleted successfully");
		  if(callbackOnSuccess!= undefined)
		  {
			  callbackOnSuccess(data, textStatus, jqXHR);
		  }
		})
		.fail(function( jqXHR, textStatus, errorThrown ){
		  console.log('deleteInstance returned error:'+ textStatus);
		  console.log('errorThrown:'+ errorThrown);
		  if(callbackOnError!= undefined)
		  {
			  callbackOnError(jqXHR, textStatus, errorThrown);
		  }
		  else if(jqXHR!= undefined && jqXHR.responseJSON!= undefined && jqXHR.responseJSON.error_description!= undefined)
		  {
			  if(jqXHR.responseJSON.error_description.length>0)
			  {
				  var error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  alert(error_description);
				  
			  }
		  }
		});
	};
}

