    var a = document.getElementById("loginBtn");
    var b = document.getElementById("registerBtn");
    var x = document.getElementById("login");
    var y = document.getElementById("register");

    function login() {
        x.style.left = "4px";
        y.style.right = "-520px";
        a.className += " white-btn";
        b.className = "btn";
        x.style.opacity = 1;
        y.style.opacity = 0;
    }

    function register() {
        x.style.left = "-510px";
        y.style.right = "5px";
        a.className = "btn";
        b.className += " white-btn";
        x.style.opacity = 0;
        y.style.opacity = 1;
    }
    function myMenuFunction() {
        var i = document.getElementById("navMenu");
    
        if(i.className === "nav-menu") {
            i.className += " responsive";
        } else {
            i.className = "nav-menu";
        }
    }
    function Login(){
        var un = document.forms["myForm"]["Uname"].value;
        var pw = document.forms["myForm"]["Pass"].value;
        if(un=="student" && pw=="1234"){
            window.location.href="home.html";
            alert("Login successful!");
        }
        else if(un=="admin" && pw=="0000"){
            window.location.href="admin_home.html";
            alert("Login successful!");
        }
        else{
            alert("Invalid Username or Password");
        }
    }
    
    