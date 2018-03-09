
var km;
var EmpData;
var u;

jQuery(function () {
    //var EmpData=[];
    var d = new Date();


    //for Show First 
    $('strong').text(d.toDateString());

    var timer = setInterval(function () {
        var d = new Date();
        $("#time").val(d.toLocaleTimeString());
    }, 1000);
    $('div [name="slidwindow"').addClass("js");
    $("#Firstreport").on("click", function (event) {
        event.preventDefault();
        ShowFirstReport.init(1);

    });
    $("#CreateEmp").on("click", function (event) {
        event.preventDefault();
        AddEmployee.init();
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
                    SaveData.obj = l;
                    e.Show(SaveData.obj);
                    EmpData=km = l;
                },
                error: function () {
                    alert("error");
                },
                cache: false
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
            Nemp.prop({ "min": arr[0].ID, "max": arr[arr.length - 1].ID });
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
        var myxml;
        var ToDay = new Date().getUTCDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
        var time;
        var stutas;
        var id;
        function save(doc) {

            $.ajax({
                url: "Save.aspx/WriteXML",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(doc),
                method: "post",
                success: function () {
                    alert("ok");
                }
            });

        }
        $.ajax({
            url: 'File.xml',
            success: function (res) {
                myxml = res;
                km = res;
                console.log("Get XML correct");
                $(res).find("Day").each(function () {
                   // alert($(this).attr("date"));
                });
            },
            error: function () {
                //alert();
                console.log("Error When Get XML");
            },
            complete: function () {
                var myDate=new Date();
                
                time = $("#time").val();
                status = $("#status").val();
                id = $("#Nemp").val();
                var Obj = {};

                if ($(km).find('Day[date="' + ToDay + '"]').text()) {
                    var currentdate = $(km).find('Day[date="' + ToDay + '"]');

                    var currentemp =$(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]').html();
                    //alert(currentdate.find("ffdfd" + 'employee[id="' + id + '"]').text());

                    if (currentdate.find('employee[id="' + id + '"]').text()) {
                        if (status == 1) {
                            if ($(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]').find('in').text()) {
                           //     alert();
                                $("#Error").text("Already Attandance ");
                                return;
                            } else {
                                $(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]').append("<in>" + time + "</in>");
                                $("#Error").text("");

                            }

                        }
                        else {
                            if ($(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]').find('in') == "") {
                                $("#Error").text("Record Attandance Frist");
                                return;
                            }
                            else if ($(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]').find('out').text()) {
                                $("#Error").text("You Already Leaved");
                                return;
                            }
                            else {
                                var inTime =new Date("1/1/1900 " +$(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"] in').text());
                                var outTime = new Date("1/1/1900 " + time);
                               // alert("DAteSS" + new Date(inTime.getTime() - outTime.getTime()).toLocaleTimeString());
                                var Hours = new Date(Math.abs(inTime - outTime));
                               // alert(Hours);
                                $(km).find('Day[date="' + ToDay + '"] employee[id="' + id + '"]')
                                    .append("<out>" + time + "</out>")
                                    .append("<Hours>" +(Hours.getHours()-2)+":"+Hours.getMinutes()+":"+Hours.getSeconds()+"</Hours>");
                                $("#Error").text("Leaved");

                            }
                        }
                      

                    }
                    else {
                       // alert("enter");
                        if (status == 1) {
                            $(km).find('Day[date="' + ToDay + '"]').append('<employee id="' + id + '"><in>' + time + '</in></employee>');
                            $("#Error").text("attandance");

                        }
                        else {
                            $("#Error").text("Record Attandance First");
                            return;
                        }
                       
                    }

                }
                else {
                    if (status == 1) {
                        $(km).find("Employees").append('<Day date="' + ToDay + '"><employee id="' + id + '"><in>' + time + '</in></employee></Day>');

                    }
                    else {
                        $("#Error").text("Record Attandance First");
                        return;
                    }
                }
                
                Obj.path = "File.xml";
                Obj.xmlStr = "<Employees>" + $(km).find('Employees').html()+"</Employees>";

                save(Obj);
            }


        });


    });

    $("#report2").on("click", function (event) {
        event.preventDefault();
        ShowFirstReport.init(0);
    });

    var ShowFirstReport = {

        container: $("#report1"),
        myxml:"",
        init: function (flag) {
            this.show(flag);
        },
        show: function (flag) {
            //send object that refer to this 
            ShowFirstReport.close.call(ShowFirstReport.container);
            ShowFirstReport.container.slideToggle(500, function () { });
            $.ajax({
                url: 'File.xml',
                success: function (res) {
                    ShowFirstReport.myxml = res;
                    km = res;
                    var Dates = $("#Dates");
                    Dates.empty();
                    $(res).find("Day").each(function () {
                        Dates.append('<option value="' + $(this).attr("date") + '"/>');
                    });
                    if (flag == 1) {
                        $("#myDate").on("input", function () {
                            ShowFirstReport.SetONTable(1);
                        });
                    }
                    else {
                        $("#myDate").on("input", function () {
                            ShowFirstReport.SetONTable(flag);
                        });

                    }
                },
                cache:false,
                complete: function () {

                }
            });
        },
        Absencerep: function () {
            var arrId = [];
            var arrtb = [];
            $(this.myxml).find("employee").each(function () { arrId.push(Number($(this).attr("id"))); })
            for (var i = 0; i < EmpData.length; i++) {
                var emp = EmpData[i];
               // alert(typeof emp.ID);
                if (arrId.indexOf(Number(emp.ID)) == -1)
                    arrtb.push([emp.ID, emp.Fname + " " + emp.Mname + " " + emp.Lname]);

            }
           
            var table = $("#tbrep").DataTable({
                data: arrtb,
                columns: [
               { title: "ID" },
               { title: "Name" }],
                iDisplayLength: 10,
                destroy: true,
                order: true
            }
                    );
          table.order([[1, 'asc'], [2, 'asc']]);


        },
        Plot$Rep1: function () {

            var thisdata = $(ShowFirstReport.myxml).find('Day[date="' + $(this).val() + '"]')

            var arr = [];
            var arrplot = [];
            emps = $(thisdata).find("employee").each(function () {
                var empId = $(this).attr("id");
                var iin = $(this).children("in").text();
                var out = $(this).children("out").text();
                var Hours = $(this).children("Hours").text();
               // Xaxis.push([EmpData.filter(emp=>emp.ID == empId)[0].Fname, empId]);
                arrplot.push([EmpData.filter(emp=>emp.ID == empId)[0].Fname, Number(Hours.split(":")[0])]);
                arr.push([Number(empId), EmpData.filter(emp=>emp.ID == empId)[0].Fname, iin, out, Hours]);

            }).promise().done(function () {

                $.plot("#Left", [arrplot], {
                    series: {
                        bars: {
                            show: true,
                            barWidth: 1,
                            align: "center"
                        }
                    },
                    xaxis: {
                        mode: "categories",
                        tickLength: 0
                    },

                });
                var table = $("#tbrep").DataTable({
                    data: arr,
                    columns: [
                   { title: "ID" },
                   { title: "Name" },
                   { title: "In" },
                   { title: "out" },
                    { title: "Hours" }
                    ],
                    iDisplayLength: 10,
                    destroy: true,
                    order: true
                }
                     );
                table.order([[1, 'asc'], [2, 'asc']]);
            });

        }
        ,
        SetONTable: function (flagF) {
            var currDate=$("#myDate");
            if (currDate.val() == "")
                return;           
            if (checkExists(currDate.val()) != true) {
                return;

            }

            function checkExists(inputValue) {
                console.log(inputValue);
                var x = document.getElementById("Dates");
                var i;
                var flag;
                for (i = 0; i < x.options.length; i++) {
                    if (inputValue == x.options[i].value) {
                        flag = true;
                    }
                }
                return flag;
            }
           
            if (flagF == 1) {
                this.Plot$Rep1.call(currDate);
            }
            else if(flagF==0)
                this.Absencerep(currDate);
          
        },
        close: function () {
            var $this = $(this);
            if ($this.find("span.close")[0]) return;
            $("<span class='close'>X</span>")
                .prependTo(this)
                .on("click", function () {
                    $this.slideToggle(500, function () {
                        $("#Dates").empty();
                        $("#myDate").val("");
                        $this.find("table").empty();
                        $("#Left").empty();
                    });
                    
                });

        }
    };


    var AddEmployee = {

        container: $("#AddEmp"),
        init: function () {
            this.show();
            $('form').submit(function (event) {
                event.preventDefault();
                var m = $(this).serializeArray();
                var k = {};
                k.ID = Number(SaveData.obj[SaveData.obj.length-1].ID)+1;
                k.Fname = m[0].value;
                k.Mname = m[1].value;
                k.Lname = m[2].value;
                k.Bdate = m[3].value;
                k.Salary = Number(m[4].value);
                k.attTime = m[5].value;
                SaveData.obj.push(k);
                var mm = {};
                mm.Emps = JSON.stringify(SaveData.obj);
                //alert(JSON.stringify(mm));
                $.ajax({
                    url: "Save.aspx/SetEmp",
                    method: "post",
                    contentType: "application/json",
                    success: function (res) {
                       // alert(res);
                        m = res;
                    },
                    data: JSON.stringify(mm),
                    cach: false,
                    error: function () {
                        alert("error");
                    },
                    dataType: "json"
                });

            });
        },
        show: function () {
            //get All Employee
            $.ajax({
                url: "Save.aspx/ReadEmp",
                contentType: "application/json",
                dataType: "json",
                method: "post",
                success: function (res) {
                    l = $.parseJSON(res.d);
                    u=SaveData.obj = l;//$.merge([], l);
                    //alert(SaveData.obj.length);
                },
                error: function () {
                    alert("error");
                }
            });


            //send object that refer to this 
            AddEmployee.close.call(AddEmployee.container);
            AddEmployee.container.slideToggle(500);
        },
        close: function () {
            var $this = $(this);
            if ($this.find("span.close")[0]) return;
            $("<span class='close'>X</span>")
                .prependTo(this)
                .on("click", function () {
                    $this.find('input[type!="submit"]').each(function () {
                        $(this).val("");
                        
                    });
                    $this.slideToggle(500);
                    
                });

        }
    };

});
