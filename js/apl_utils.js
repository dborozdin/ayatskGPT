	var formattedUndefinedValueString="< значение не задано >";
		
	function setCookie(name, value, options) {
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
		  updatedCookie += "=" + propValue;
		}
	  }

	  document.cookie = updatedCookie;
	}	

	function getCookie(name) {
	  var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	  ));
	  return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	var showDisableLayer = function(userMessage, finalFunc) {
		if(userMessage== undefined)
		{
			userMessage= 'Подождите, идет загрузка данных...';
		}
		$.blockUI(
		  {
			message: userMessage, 
			showOverlay: false, 
			centerY: true, 
			css: { 
				border: 'none', 
				padding: '5px', 
				backgroundColor: '#000', 
				'-webkit-border-radius': '10px', 
				'-moz-border-radius': '10px', 
				opacity: .6, 
				color: '#fff' 
			} 
		  });
	};

	var hideDisableLayer = function() {
		$.unblockUI();
	};

	function is_touch_device() {
	  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	  var mq = function(query) {
		return window.matchMedia(query).matches;
	  }

	  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		return true;
	  }

	  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
	  // https://git.io/vznFH
	  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	  return mq(query);
	}

	function GetFormattedAttrValue(attr, isDate)
	{
		var value= attr;
		if(attr==undefined)
		{
			value= formattedUndefinedValueString;
		}
		else
		{
			if(isDate==true)
			{
				value= convertDbTimeToNative(attr);
			}
		}
		return value;
	}

	//получить текущую дату в строковом формате
	function getNow()
	{
		  var date = new Date();
		  var day = "" + date.getDate();
		  if (day.length == 1)
		  {
			day = "0" + day;
		  }
		  var month = "" + (date.getMonth() + 1);
		  if (month.length == 1)
		  {
			month = "0" + month;
		  }
		  var year = date.getFullYear();

		  return year+"-"+month+"-"+day;
	}
	function getNowLocal()
	{
		  var date = new Date();
		  var day = "" + date.getDate();
		  if (day.length == 1)
		  {
			day = "0" + day;
		  }
		  var month = "" + (date.getMonth() + 1);
		  if (month.length == 1)
		  {
			month = "0" + month;
		  }
		  var year = date.getFullYear();

		  return day+"."+month+"."+year;
	}
	function convertDbTimeToNative(dbDate)
	{
		if(dbDate == null || dbDate == undefined || dbDate == "")
			return "";

		var year = dbDate.substring(0, 4);
		var month = dbDate.substring(4, 6);
		var day = dbDate.substring(6, 8);

		return day + "." + month + "." + year;
	}
	function convertNativeTimeToDb(nativeDate)
	{
		if(nativeDate == null || nativeDate == undefined || nativeDate == "")
			return "";
			
		var year = nativeDate.substring(6, 12);
		var month = nativeDate.substring(3, 5);
		var day = nativeDate.substring(0, 2);
		
		return year + month + day + "000000";
	}
	function convertDateToDb(dateObject)
	{
		if(dateObject == undefined )
			return "";
			
		var year = dateObject.getFullYear();
		var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
		var day = ("0" + dateObject.getDate()).slice(-2);
		
		return year + month + day + "000000";
	}

	function convertDbTimeToJQMobile(dbDate)
	{
		if(dbDate == null || dbDate == undefined || dbDate == "")
			return "";

		var year = dbDate.substring(0, 4);
		var month = dbDate.substring(4, 6);
		var day = dbDate.substring(6, 8);

		return year+"-"+month+"-"+day;
	}