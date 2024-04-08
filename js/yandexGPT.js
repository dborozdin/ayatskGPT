var yandexApiKey;
var yandexFolderId;
var yandexGenerateFunctionsCnt;

function sendRequestToYandex(yandexRequestParams, callbackOnSuccess, callbackOnFail)
{
    console.log('sendRequestToYandex');
    console.log('yandexRequestParams:',yandexRequestParams);
    //var responseForTest="[\n    {\n        \"function\": \"Охлаждение воздуха в салоне\",\n        \"description\": \"Поддержание комфортной температуры для пассажиров и экипажа\"\n    },\n    {\n        \"function\": \"Регулирование влажности воздуха\",\n        \"description\": \"Предотвращение запотевания окон и обеспечение комфорта пассажиров\"\n    },\n    {\n        \"function\": \"Фильтрация воздуха\",\n        \"description\": \"Удаление пыли, бактерий и других загрязнений из воздуха\"\n    },\n    {\n        \"function\": \"Вентиляция салона\",\n        \"description\": \"Обеспечение циркуляции воздуха для поддержания свежести\"\n    },\n    {\n        \"function\": \"Контроль температуры и влажности в багажном отсеке\",\n        \"description\": \"Сохранение целостности груза и предотвращение его порчи\"\n    }\n]";
    //createNewFunctionsInDb(yandexRequestParams, responseForTest, UpdateFunctionsList, onRestError);
    //return;
    let query= '{'+
                    '"modelUri": "gpt://'+ yandexRequestParams.yandexFolderId+'/yandexgpt",' +
                    '"completionOptions": {'+
                    '"stream": false,'+
                    '"temperature": 0.1,'+
                    '"maxTokens": "1000"'+
                '},'+
                    '"messages": ['+
                    '{'+
                        '"role": "system",'+
                        '"text": "Выдай ответ в формате JSON в виде массива объектов с полями function, description.'+
                        'Выдай перечень из по крайней мере '+ yandexRequestParams.yandexGenerateFunctionsCnt+' вариантов"'+
                    '},'+
                    '{'+
                        '"role": "user",'+
                        '"text": "Перечисли функции системы \''+ yandexRequestParams.systemData.attributes.name_rus+'\' изделия \''+ yandexRequestParams.fiData.attributes.name_rus+'\'"'+
                    '}'+
                ']'+
                '}';
    console.log('query:',query);
    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", yandexRequestParams.yandexApiKey);
            request.setRequestHeader("x-folder-id", yandexRequestParams.yandexFolderId);
        },
        url: "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        dataType: 'json',
        data: query,
        complete: function(jqXHR, textStatus) {
            console.log('sendRequestToYandex query complete.TextStatus:',textStatus);
        },
        success: function(data) {
            console.log('sendRequestToYandex query success');
            if(callbackOnSuccess!=undefined)
            {
                console.log('functions data:', data);
                callbackOnSuccess(yandexRequestParams, data);
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

function createNewFunctionsInDb(yandexRequestParams, jsonData, callbackOnSuccess, callbackOnFail)
{
    console.log('createNewFunctionsInDb');
    console.log('jsonData:', jsonData);

    jsonObj = JSON.parse(jsonData);
    if(jsonObj)
    {
        var elemsCnt= jsonObj.length;
        var succInd=0;
        function onSuccessAll()
        {
            succInd++;
            if(succInd==elemsCnt)
            {
                callbackOnSuccess();
            }
        }
        jsonObj.forEach((response_element, index, array) => {
            console.log('response_element.function:',response_element.function);
            console.log('response_element.description:',response_element.description);
            console.log('index:', index);
            var functionLCN= ''+yandexRequestParams.systemData.attributes.id+'-'+ index;
            aplAPI_BL.createNewFunction(yandexRequestParams.systemData.id,
                                        functionLCN,
                                        response_element.function,
                                        response_element.description,
                                        onSuccessAll,
                                        onRestError);
        });
    }
}

function onYandexSuccess(yandexRequestParams, response)
{
    console.log('onYandexSuccess');
    console.log('response:', response);
    createNewFunctionsInDb(yandexRequestParams, response.result.alternatives[0].message.text, UpdateFunctionsList, onRestError);

}

function onYandexError(jqXHR, textStatus, errorThrown)
{
    console.log('onYandexError');
    console.log('jqXHR:', jqXHR);
    console.log('textStatus:', textStatus);
    console.log('errorThrown:', errorThrown);
}

