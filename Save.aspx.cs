using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

public class Employee
{
    public String Lname { get; set; }
    public String Mname { get; set; }
    public String Fname { get; set; }
    public string attTime { get; set; }
    public String Bdate { get; set; }

    public int Salary { get; set; }
   
}
public partial class Ajax_For_Project_ave : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Form.Count != 0)
        {
            Response.ContentType = "application/text";
            Response.Write("<div id='main'>");
            Response.Write("<h1>" + Request.Form[0] + "</h1>");
            Response.Write("<h1>" + Request.Form[1] + "</h1>");
            Response.Write("<h1>" + Request.Form[2] + "</h1>");
            Response.Write("<h1>" + Request.Form[3] + "</h1>");
            //Response.Write("<h1>" + Request.Form[4] + "</h1>");
            //Response.Write("<h1>" + Request.Form[5] + "</h1>");
            //Response.Write("<h1>" + Request.Form[6] + "</h1>");
            Response.Write("</div>");

            FileStream fs = new FileStream(Server.MapPath("Files/Data.txt"), FileMode.Open);

            StreamWriter sr = new StreamWriter(fs);
            sr.Write(Request.Form[0] + " " + Request.Form[1] + " " + Request.Form[2]);
            sr.Close();
            fs.Close();
        }
    }
    [WebMethod]
    ///[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public static String SetEmp(String  Emps)
    {
        FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath("Data.txt"), FileMode.Open);

        StreamWriter sr = new StreamWriter(fs);
        sr.Write(Emps);
        sr.Close();
        fs.Close();
        return Emps;
    }
    [WebMethod]
    public static string ReadEmp()
    {
        
        FileStream fs = new FileStream(System.Web.HttpContext.Current.Server.MapPath("Data.txt"), FileMode.Open);

        StreamReader sr = new StreamReader(fs);
        string str=sr.ReadToEnd();
        sr.Close();
        fs.Close();
        return str;
    }
    [WebMethod]
    public static List<Employee> GetAllEmployee()
    {
        List<Employee> Larr = new List<Employee>();
        Larr.Add(new Employee() { Fname = "Faten", Mname = "Elsayed", Lname = "elhariry", attTime = "03:5", Salary = 5000, Bdate = "" });
        Larr.Add(new Employee() { Fname = "Ahmed", Mname = "Elsayed", Lname = "elhariry", attTime = "03:5", Salary = 5000, Bdate = "" });
        Larr.Add(new Employee() { Fname = "Reem", Mname = "Elsayed", Lname = "elhariry", attTime = "03:5", Salary = 5000, Bdate = "" });
        Larr.Add(new Employee() { Fname = "Mohammed", Mname = "Elsayed", Lname = "elhariry", attTime = "03:5", Salary = 5000, Bdate = "" });
        Larr.Add(new Employee() { Fname = "Mahmmoud", Mname = "Elsayed", Lname = "elhariry", attTime = "03:5", Salary = 5000, Bdate = "" });

        return Larr;
    }
    [System.Web.Services.WebMethod]
    //[ScriptMethod(ResponseFormat = ResponseFormat.Xml)]
    public static string WriteXML(string xmlStr,string path)
    {
        if (!File.Exists(HttpContext.Current.Server.MapPath("./" + path)))
            File.Create(HttpContext.Current.Server.MapPath("./" + path)).Close();
        
        string filepath = System.Web.HttpContext.Current.Server.MapPath("./" + path);
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(xmlStr);
        doc.Save(filepath);
        return "ok";
    }

    [WebMethod]
    public static String GetFiles()
    {
        String MYFILES="";
        foreach (String item in Directory.GetFiles(HttpContext.Current.Server.MapPath("./Files")))
        {
            MYFILES += item.Split('\\')[item.Split('\\').Length-1].Split('.')[0]+",";
        }
        return MYFILES.Remove(MYFILES.LastIndexOf(','));
    }


}
