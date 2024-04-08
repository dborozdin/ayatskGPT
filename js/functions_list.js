function drawFunction(functionsList, data)
{
    if(data==undefined || data.attributes==undefined)
    {
        return;
    }
    var functionLCN= GetFormattedAttrValue(data.attributes.lcn);
    var functionName= GetFormattedAttrValue(data.attributes.name_rus);
    var functionDescr= GetFormattedAttrValue(data.attributes.descr_rus);

    console.log('functionLCN: ', functionLCN);
    console.log('functionName: ', functionName);
    console.log('functionDescr: ', functionDescr);

    var rowId= "FuncRow"+ data.id;
    var htmlAppendRow = document.createElement("tr");
    htmlAppendRow.setAttribute("id", rowId);
    //htmlAppendRow.dataset.ComponentObj= data;
    var htmlAppendFunctionLCN= document.createElement("td");
    htmlAppendFunctionLCN.innerHTML=functionLCN;
    htmlAppendRow.appendChild(htmlAppendFunctionLCN);
    var htmlAppendFunctionName= document.createElement("td");
    htmlAppendFunctionName.innerHTML=functionName;
    htmlAppendRow.appendChild(htmlAppendFunctionName);
    var htmlAppendFunctionDescr= document.createElement("td");
    htmlAppendFunctionDescr.innerHTML= functionDescr
    htmlAppendRow.appendChild(htmlAppendFunctionDescr);

    functionsList.appendChild(htmlAppendRow);
    $( "#"+rowId ).data( "FunctionObj", data );
    $( "#funcName"+data.id ).data( "FunctionObj", data );

    var FuncData= $( "#funcName"+data.id ).data( "FunctionObj");
    console.log('Function data: '+ "#funcName"+data.id, FuncData);


}


function UpdateFunctionsListTable(data, queryCnt)
{
    console.log('UpdateFunctionsListTable');

    var funcList= document.getElementById("functionsListTable");
    var childNodes;
    if(funcList!=undefined)
    {
        childNodes= funcList.childNodes;
    }
    if(data!= undefined && data.instances!= undefined)
    {
        console.log('data:', data);
        for(var i=0; i!= data.instances.length; i++)
        {
            var functionInstance= data.instances[i];
            var newFuncLCN= functionInstance.attributes.lcn;
            console.log('add ' + i +  ' instance with lcn:'+newFuncLCN);

            drawFunction(funcList, functionInstance);
        }
    }
    $("#functionsListUpdateStatus").text("");
    $("#generateFunctionsList").attr("disabled", false);
    hideDisableLayer();
    $('#functionsListTable').hide().show(0);


}

function UpdateFunctionsList()
{
    console.log('UpdateFunctionsList')
    if(clickedComponentRelation==undefined)
    {
        return;
    }
    console.log('clickedComponentRelation:', clickedComponentRelation)
    //загрузка перечня функций для связи с системой
    var relationId= clickedComponentRelation.id;
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
    $("#generateFunctionsList").attr("disabled", true);
    $("#functionsListTable").empty();
    $("#functionsListUpdateStatus").text("Загрузка перечня функций системы...");
    aplAPI_BL.getFunctionsList(relationId, clickedComponentId, UpdateFunctionsListTable, onRestError);

}

function GenerateFunctions()
{
    console.log('GenerateFunctions')
    console.log('clickedFI:', clickedFI)
    console.log('clickedComponent:', clickedComponent)
    console.log('clickedComponentRelation:', clickedComponentRelation)

    yandexApiKey= $("#generate_dlg_API_key").val();
    yandexFolderId= $("#generate_dlg_API_folder").val();
    yandexGenerateFunctionsCnt= $("#generate_dlg_cnt_functions").val();

    var yandexRequestParams={};
    yandexRequestParams.systemData= clickedComponent;
    yandexRequestParams.fiData= clickedFI;
    yandexRequestParams.yandexApiKey= yandexApiKey;
    yandexRequestParams.yandexFolderId= yandexFolderId;
    yandexRequestParams.yandexGenerateFunctionsCnt= yandexGenerateFunctionsCnt;
    sendRequestToYandex(yandexRequestParams, onYandexSuccess, onYandexError);

    setCookie("yandexApiKey", yandexApiKey);
    setCookie("yandexFolderId", yandexFolderId);
    setCookie("yandexGenerateFunctionsCnt", yandexGenerateFunctionsCnt);


}

function readGenerationParamsFromCookies()
{
    yandexApiKey= getCookie("yandexApiKey");
    console.log('apiKey from Cookie:', yandexApiKey);
    $("#generate_dlg_API_key").val(yandexApiKey);
    yandexFolderId= getCookie("yandexFolderId");
    console.log('folder id from Cookie:', yandexFolderId);
    $("#generate_dlg_API_folder").val(yandexFolderId);
    yandexGenerateFunctionsCnt= getCookie("yandexGenerateFunctionsCnt");
    console.log('functions count id from Cookie:', yandexGenerateFunctionsCnt);
    if(yandexGenerateFunctionsCnt==undefined)
    {
        yandexGenerateFunctionsCnt="5";
    }
    $("#generate_dlg_cnt_functions").val(yandexGenerateFunctionsCnt);

}




