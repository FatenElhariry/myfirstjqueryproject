/// <reference path="jquery-3.1.1.js" />
var km;


$(function () {
    
    var d = new Date();
  
    
    //for Show First 
    $('strong').text(d.toDateString());
    
    var timer = setInterval(function () {
        var d = new Date();
        $("#time").val(d.toLocaleTimeString());
    }, 1000);

    $("#CreateEmp").on("click", function (event) {
        event.preventDefault();
        alert();
        $("#sec").slideDown(2000);
    });
   
    
  //Dealing With Json First 
    var SaveData = {
        obj: [],
        inti: function (e) {

            $.ajax({
                url: "Save.aspx/ReadEmp",
                contentType: "application/json",
                dataType: "json",
                method: "post",
                success: function (res) {
                    l = $.parseJSON(res.d);
                    SaveData.obj = $.merge([], l);
                    e.Show(SaveData.obj);
                    
                },
                error: function () {
                    alert("error");
                },
                cache:false
            });

        },
        ////handle show 
        Show: function (arr) {
            var sel = $("#emps");
            var Nemp = $("#Nemp");
            ///add element
            this.obj.forEach(function (elem) {
                $("<option value='" + elem.ID + "'>" + elem.Fname + "</option>").appendTo(sel);
            });
            Nemp.prop({"min":arr[0].ID,"max":arr[arr.length-1].ID});
            Nemp.val(sel.val());
            ///when change
            sel.on("change", function () {
                Nemp.val($(this).val());
            });
            ////
            Nemp.on("change", function (event) {
                sel.val($(this).val());
            });
        }
    };
    SaveData.inti(SaveData);
    $("#btn").on("click", function () {

        dealXml.LoadFile.call(dealXml);
        console

    });

    var time;
    var stutas;
    var id;
    var dd = new Date(Date.now());
    
    alert(dd.getUTCDate());
    var dealXml = {
        myxml1: {},
        FileName:new Date().getUTCDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear()+'.xml',
        LoadFile: function () {
            
              $.ajax({
                url: this.FileName,
                success: function (res) {
                    this.myxml1 = res;
                    km = res;
                    alert($(this.myxml1).find("Employees").html());
                    console.log("Get XML correct");
                },
                error: function () {
                    console.log("Error When Get XML");
                },
                mydata:this.myxml1,
                complete: function () {
                    time=$("#time").val();
                    status=$("#status").val();
                    id = $("#Nemp").val();
                    var current = $(myxml1).find('employee[id="' + id + '"]').html();
                    alert(current);

                    var obj = {};
                    if (myxml1 != null) {
                        alert();
                        $(myxml1).find("Employees").append('<employee id="' + id + '"><in>' + time + '</in></employee>');
                        obj.xmlStr = "<Employees>" + $(myxml1).find('Employees').html() + "</Employees>";

                    }
                    else {
                        this.myxml1 = '<Employees><employee id="' + id + '"><in>' + time + '</in></employee></Employees>';
                        obj.xmlStr = myxml1;
                        alert(obj.xmlStr);
                    }
                    alert(this.FileName);
                    obj.path = this.FileName;
                    dealXml.save(obj);
                }
            });
        },
        save :function(doc){
           
            $.ajax({
                url: "Save.aspx/WriteXML",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(doc),
                method: "post"
            });
        }
    }
    var d = $("#move");
    var w=$('window').width()/2+d.width();
    var h=$('window').height()/2+d.height();

 
       
       // if (stutas.val() == 0)
          //  out = d.toLocaleTimeString()
       // else
          //  iin = d.toLocaleTimeString();
       // alert($(myxml).html());

     
        
        


});