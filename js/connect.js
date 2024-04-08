	function readConnectionParamsFromCookies()
	{
		var oldUserName= getCookie("userName");
		console.log('userName from cooki:'+ oldUserName);
		if(oldUserName==undefined || oldUserName=="")
		{
			oldUserName="Administrator";
		}
		$("#connect_dlg_user").val(oldUserName);
		var oldPass= getCookie("userPassword");
		console.log('userPassword from cooki:'+ oldPass);
		$("#connect_dlg_password").val(oldPass);
		var oldPort= getCookie("port");
		console.log('port from cooki:'+ oldPort);
		if(oldPort==undefined || oldPort=="")
		{
			oldPort="7239";
		}
		$("#connect_dlg_port").val(oldPort);
		var oldServer= getCookie("server");
		console.log('server from cooki:'+ oldServer);
		if(oldServer==undefined || oldServer=="")
		{
			var currentHostname= window.location.hostname;
			if(currentHostname==undefined)
			{
				currentHostname= "localhost";
			}
			oldServer=currentHostname;
		}
		$("#connect_dlg_server").val(oldServer);	
	}
	function UpdateDBListCombo(data)
	{
		console.log('UpdateDBListCombo');
		var dbCombo = $("#connect_dlg_db");
		dbCombo.attr("disabled", false);
		dbCombo.empty();
		if(data==undefined || data.dblist== undefined)
		{
			dbCombo.selectmenu("refresh", true);
			return;
		}
		var oldChosenDB= getCookie("chosenDB");
		var bSelectedDB= false;
		for(var i=0; i!= data.dblist.length; i++)
		{
			var dbName= data.dblist[i];
			dbCombo.append("<option>"+dbName+"</option>");
			if(oldChosenDB==dbName)
			{
				dbCombo.val(dbName).attr('selected', true).siblings('option').removeAttr('selected');    
				dbCombo.selectmenu("refresh", true);
				bSelectedDB= true;
			}
		}
		if(bSelectedDB==false && data.dblist.length>0)
		{
			dbCombo.val($("#connect_dlg_db option:first").val());
			dbCombo.selectmenu("refresh", true);
		}
		$("#connectBtn").attr("disabled", false);
		hideDisableLayer();
		
	}

	function UpdateDBList(bInteractive)
	{
		console.log('UpdateDBList');
		var server= $("#connect_dlg_server").val();
		if(server==undefined || server=="")
		{
			if(bInteractive==true)
			{
				alert("Введите адрес сервера!");
				return;
			}
			else
			{
				var currentHostname= window.location.hostname;
				if(currentHostname==undefined)
				{
					currentHostname= "localhost";
				}
				server= currentHostname;
			}
		}
		var port= $("#connect_dlg_port").val();
		if(port==undefined || port=="")
		{
			if(bInteractive==true)
			{
				alert("Введите номер порта!");
				return;
			}
			else
			{
				port= "7239";
			}
		}
		if(aplAPICore==undefined)
		{
			aplAPICore= new APL_js_API_core();
		}
		$("#connectBtn").attr("disabled", true);
		$("#connect_dlg_db").attr("disabled", true);
		showDisableLayer();
		aplAPICore.getDbListFromServer(server, port, UpdateDBListCombo, function(jqXHR, textStatus, errorThrown){
			  $("#connectBtn").attr("disabled", false);
			  $("#connect_dlg_db").attr("disabled", false);
			  $("#connect_dlg_db").empty();
			  $("#connect_dlg_db").selectmenu("refresh", true);
			  hideDisableLayer();
			  
			  var error_description;
			  if(jqXHR!= undefined && jqXHR.responseJSON!= undefined)
			  {
				  error_description= jqXHR.responseJSON.error_description[0];
				  console.log('error description:' + error_description);
				  if(error_description!= undefined && error_description.length>0)
				  {
					  alert(error_description);
				  }
			  }
			  else
			  {
				  alert('Не удалось получить список БД! Проверьте, запущен ли сервер приложений на указанном порту');
			  }
		});
	}
	function onConnect()
	{
		console.log('onConnect');
		function connect2NewDb()
		{
			var userName= $("#connect_dlg_user").val(); 
			if(userName==undefined || userName=="")
			{
				alert("Введите имя пользователя!");
				return;
			}
			var userPassword= $("#connect_dlg_password").val();
			var chosenDB= $("#connect_dlg_db").val();
			if(chosenDB==undefined || chosenDB=="")
			{
				alert("Выберите БД!");
				return;
			}
			var server= $("#connect_dlg_server").val();
			if(server==undefined || server=="")
			{
				alert("Введите адрес сервера!");
				return;
			}
			var port= $("#connect_dlg_port").val();
			if(port==undefined || port=="")
			{
				alert("Введите номер порта!");
				return;
			}
			console.log("userName:"+userName);
			console.log("userPassword:"+userPassword);
			console.log("server:"+server);
			console.log("chosenDB:"+chosenDB);
			console.log("port:"+port);
			if(aplAPICore==undefined)
			{
				console.log('aplAPICore object is not defined!');
				return;
			}
			setCookie("userName", userName);
			setCookie("userPassword", userPassword);
			setCookie("server", server);
			setCookie("chosenDB", chosenDB);
			setCookie("port", port);
			showDisableLayer();
			aplAPICore.connect(server, port, chosenDB, userName, userPassword, updateConnectData, onRestError);

		}
		if(aplAPICore==undefined)
		{
			console.log('aplAPICore object is not defined!');
			return;
		}
		if(aplAPICore.authorizationToken!=undefined)//disconnect previous db
		{
			aplAPICore.disconnect(connect2NewDb, connect2NewDb);
		}
		else
		{
			connect2NewDb();
		}
	}
	function updateConnectData(data, textStatus, jqXHR)
	{
	  console.log('updateConnectData');
	  if(data==undefined)
	  {
		  return;
	  }
	  if(data.session_key==undefined)
	  {
		  console.log(data.error_description);
		  alert(data.error_description);
		  return;
	  }
	  gotoFIList();
	  
	}