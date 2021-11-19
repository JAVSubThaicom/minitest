function doGet(e) {
  if (!e.parameter.page) {
    var template = HtmlService.createTemplateFromFile('homepage')
    return  template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width , initial-scale=1')
  }
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width , initial-scale=1')
}


function globalVariables(){ 
  var varArray = {
    spreadsheetId   : '1CTEXGaU8VvnGqfapxd14qkVf2BNTWpj6wPSJ4CEME54', //** CHANGE !!!!!!!!!!!!!!!!!!!!!!!!!
    dataRage        : 'data!A2:G',                                    //** CHANGE !!!
    idRange         : 'data!A2:A',                                    //** CHANGE !!!
    lastCol         : 'G',                                            //** CHANGE !!!
    insertRange     : 'data!A1:G1',                                   //** CHANGE !!!
    sheetID         : '0'                                             //** CHANGE !!! 
  };
  return varArray;
}


/* Function URL */
function getUrl() {
  var url = ScriptApp.getService().getUrl()
  return url
}





/* Function INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
/* PROCESS FORM */
function processForm(formObject){  
  if(formObject.RecId && checkID(formObject.RecId)){//Execute if form passes an ID and if is an existing ID
    updateData(getFormValues(formObject),globalVariables().spreadsheetId,getRangeByID(formObject.RecId)); // Update Data
  }else{ //Execute if form does not pass an ID
    appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange); //Append Form Data
  }
  return getLastTenRows();//Return last 10 rows
}






/* GET FORM VALUES AS AN ARRAY */
function getFormValues(formObject){
/* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
  if(formObject.RecId && checkID(formObject.RecId)){
    var values = [[formObject.RecId.toString(),
                  formObject.name,
                  formObject.textid,
                  formObject.phone,
                  formObject.gender,
                  formObject.type,
                  formObject.detail]];
  }else{
    var values = [[new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
                  formObject.name,
                  formObject.textid,
                  formObject.phone,
                  formObject.gender,
                  formObject.type,
                  formObject.dateO]];
  }
  return values;
}


/*
## CURD FUNCTIONS ----------------------------------------------------------------------------------------
*/


/* CREATE/ APPEND DATA */
function appendData(values, spreadsheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}


/* READ DATA */
function readData(spreadsheetId,range){
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}


/* UPDATE DATA */
function updateData(values,spreadsheetId,range){
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}


/*DELETE DATA*/
function deleteData(ID){ 
  var startIndex = getRowIndexByID(ID);
  
  var deleteRange = {
                      "sheetId"     : globalVariables().sheetID,
                      "dimension"   : "ROWS",
                      "startIndex"  : startIndex,
                      "endIndex"    : startIndex+1
                    }
  
  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];
  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);
  
  return getLastTenRows();//Return last 10 rows
}



/* 
## HELPER FUNCTIONS FOR CRUD OPERATIONS --------------------------------------------------------------
*/ 


/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
function checkID(ID){
  var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}


/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getRangeByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        return 'data!A'+(i+2)+':'+globalVariables().lastCol+(i+2);
      }
    }
  }
}


/* GET RECORD BY ID */
function getRecordById(id){
  if(id && checkID(id)){
    var result = readData(globalVariables().spreadsheetId,getRangeByID(id));
    return result;
  }
}


/* GET ROW NUMBER FOR GIVEN ID */
function getRowIndexByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}


/*GET LAST 10 RECORDS */
function getLastTenRows(){
  var lastRow = readData(globalVariables().spreadsheetId,globalVariables().dataRage).length+1;
  if(lastRow<=11){
    var range = globalVariables().dataRage;
  }else{
    var range = 'data!A'+(lastRow-9)+':'+globalVariables().lastCol;
  }
  var lastTenRows = readData(globalVariables().spreadsheetId,range);
  return lastTenRows;
}


/* GET ALL RECORDS */
function getAllData(){
  var data = readData(globalVariables().spreadsheetId,globalVariables().dataRage);
  return data;
}


/*
## OTHER HELPERS FUNCTIONS ------------------------------------------------------------------------
*/


/*GET DROPDOWN LIST */
function getDropdownList(range){
  var list = readData(globalVariables().spreadsheetId,range);
  return list;
}


/* INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
