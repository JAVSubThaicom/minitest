<script>
  // Prevent forms from submitting.
  function preventFormSubmit() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', function(event) {
      event.preventDefault();
      });
    }
  }
  window.addEventListener("load", functionInit, true); 
  
  //INITIALIZE FUNCTIONS ONLOAD
  function functionInit(){  
    preventFormSubmit();
    getLastTenRows();
  };      
  
  //HANDLE FORM SUBMISSION
  function handleFormSubmit(formObject) {
    google.script.run.withSuccessHandler(createTable).processForm(formObject);
    document.getElementById("myForm").reset();
  }
  
  //GET LAST 10 ROWS
  function getLastTenRows (){
   google.script.run.withSuccessHandler(createTable).getLastTenRows();
  }
  
  
  //GET ALL DATA
  function getAllData(){
    //document.getElementById('dataTable').innerHTML = "";
    google.script.run.withSuccessHandler(createTable).getAllData();
  }
  
  
  //CREATE THE DATA TABLE
  function createTable(dataArray) {
    if(dataArray){
      var result = "<table class='table table-sm' style='font-size:0.8em'>"+
                   "<thead style='white-space: nowrap'>"+
                     "<tr>"+                               //Change table headings to match witht he Google Sheet
                     "<th scope='col'>ไอดี</th>"+
                      "<th scope='col'>ชื่อ สกุล</th>"+
                      "<th scope='col'>รหัสสินค้า</th>"+
                      "<th scope='col'>เบอร์โทร</th>"+
                      "<th scope='col'>เพศ</th>"+
                      "<th scope='col'>รายละเอียด</th>"+
                      "<th scope='col'>วันที่</th>"+
                    "</tr>"+
                  "</thead>";
      for(var i=0; i<dataArray.length; i++) {
          result += "<tr>";
          //result += "<td><button type='button' class='btn btn-danger btn-xs deleteBtn' onclick='deleteData(this);'>Delete</button></td>";
          //result += "<td><button type='button' class='btn btn-warning btn-xs editBtn' onclick='editData(this);'>Edit</button></td>";
          for(var j=0; j<dataArray[i].length; j++){
              result += "<td>"+dataArray[i][j]+"</td>";
          }
          result += "</tr>";
      }
      result += "</table>";
      var div = document.getElementById('dataTable');
      div.innerHTML = result;
      document.getElementById("message").innerHTML = "";
    }else{
      var div = document.getElementById('dataTable');
      div.innerHTML = "ไม่พบข้อมูล!";
    }
  }

  //POPULATE FORM
  function populateForm(records){
    document.getElementById('RecId').value = records[0][0];
    document.getElementById('name').value = records[0][1];
    document.getElementById('textid').value = records[0][4];
    document.getElementById('phone').value = records[0][5];
    document.getElementById(records[0][2] =='มอเตอร์ไซค์'? 'moto':'car').checked = true;
    document.getElementById("type").value = records[0][6];
    document.getElementById("detail").value = records[0][6];
    document.getElementById("message").innerHTML = "<div class='alert alert-warning' role='alert'>Update Record [ID: "+records[0][0]+"]</div>";
  }
  
  //RETRIVE DATA FROM GOOGLE SHEET FOR COUNTRY DROPDOWN
  function createTypeDropdown() {
      //SUBMIT YOUR DATA RANGE FOR DROPDOWN AS THE PARAMETER
      google.script.run.withSuccessHandler(typeDropDown).getDropdownList("level!A1:A8");
  }
  
  //POPULATE COUNTRY DROPDOWNS
  function typeDropDown(values) { //Ref: https://stackoverflow.com/a/53771955/2391195
    var list = document.getElementById('type');   
    for (var i = 0; i < values.length; i++) {
      var option = document.createElement("option");
      option.value = values[i];
      option.text = values[i];
      list.appendChild(option);
    }
  }
  
  function fileUploaded(status) {
        document.getElementById('myForm').style.display = 'none';
        document.getElementById('output').innerHTML = status;
    }
  
</script>

<!-- Fontawesome -->
<script src="https://kit.fontawesome.com/ad42651166.js" crossorigin="anonymous"></script>

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>


<!-- Sweetalert -->
<script src="//cdn.jsdelivr.net/npm/sweetalert2@10"></script>
