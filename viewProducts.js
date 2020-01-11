var productsArray=[];
var cart=[];
var username;
var navigation=document.getElementById("navigation");
var divListOfProducts=document.getElementById("divListOfProducts");
function getUserInfo(){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            username=this.responseText;
            getCartProducts();
        }
    }
  xhttp.open("GET", "/getUserInfo", true);
  xhttp.send();
}
function getCartProducts()
{
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            cart=JSON.parse(this.responseText);
            console.log(cart);
            getUserDetails();
        }
    }
  xhttp.open("GET", "/cartProducts", true);
  xhttp.send();
}
function lgout()
{
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            console.log("LOGOUT");
        }
    }
  xhttp.open("GET", "/logout", true);
  xhttp.send();
  location.href='/login';
}
function getUserDetails()
{
    if(username=="")
        {
            var signUp=document.createElement("a");
            var textNode=document.createTextNode("SIGN UP");
            signUp.appendChild(textNode);
            signUp.setAttribute("href","SignUp")
            signUp.setAttribute("style","font-family: 'Exo 2', sans-serif;margin-right:100px;margin-left:30px;text-decoration: none;");
            navigation.appendChild(signUp);
            var login=document.createElement("a");
            var textNode=document.createTextNode("LOGIN");
            login.appendChild(textNode);
            login.setAttribute("href","login")
            login.setAttribute("style","font-family: 'Exo 2', sans-serif;margin-left:100px;text-decoration: none;");
            navigation.appendChild(login);
            
            var search=document.createElement("input");
            search.setAttribute("tyoe","text");
            search.setAttribute("placeholder"," Search for products, brands and more");
            search.setAttribute("style","border:none;outline:none;background:#f1f1f1;border-radius:20px;width:25%;height:5%;padding: 17px;font-family: 'Exo 2', sans-serif;float:right;margin-left:100px;margin-top:15px;text-decoration: none;");
            navigation.appendChild(search);
            
        }
        else
            {
            username=username.slice(1,username.length-1);
            var logout=document.createElement("a");
            var textNode=document.createTextNode("LOGOUT");
            logout.appendChild(textNode);
            logout.setAttribute("style","font-family: 'Exo 2', sans-serif;margin-right:100px;margin-left:30px;font-size:20px;text-decoration: none;");
            navigation.appendChild(logout); 
                
            var myCart=document.createElement("a");
            var textNode=document.createTextNode(" My Cart");
            myCart.appendChild(textNode);
            myCart.setAttribute("href","cart")
            myCart.setAttribute("class","fa fa-shopping-cart")
            myCart.setAttribute("style","font-size:20px;margin-left:100px;text-decoration: none;");
            navigation.appendChild(myCart);
                
            var search=document.createElement("input");
            search.setAttribute("tyoe","text");
            search.setAttribute("placeholder"," Search for products, brands and more");
            search.setAttribute("style","float:right;border:none;outline:none;background:#f1f1f1;border-radius:20px;width:25%;height:5%;padding: 17px;font-family: 'Exo 2', sans-serif;margin-left:100px;margin-top:15px;text-decoration: none;");
            navigation.appendChild(search);
                
            var greet=document.createElement("p");
            greet.setAttribute("style","margin-right:200px;font-weight:bold;display:inline;");
            greet.innerHTML="Hey "+username+"!";
            navigation.appendChild(greet);
                
            logout.addEventListener("click",function(event){
                console.log("oij");
                lgout();
            });
                
        }
}

function updateDatabase(obj,id){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log("updated");
    }
  };
  xhttp.open("POST", "/updateCart", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("cart="+JSON.stringify(obj)+"&id="+JSON.parse(id)+"&usr="+JSON.stringify(username));
}

function storeProducts()
{
     var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("Appended");
    }
  };
  xhttp.open("POST", "/carts", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("cart="+JSON.stringify(cart));
}

function getStoredProducts()
{
    getUserInfo();
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200)
    {
    productsArray=JSON.parse(this.responseText);
    for(i=0;i<productsArray.length;i++)
    {
    addProductToDOM(productsArray[i]);
    }
    productId=productsArray[i-1].id+1;
    }
  }
  xhttp.open("GET", "/array", true);
  xhttp.send();
}

function checkValidation(value)
{
    if(value>0 && !isNaN(value))
        {
            return true;
        }
    else
        {
            alert("Quantity must be numeric and greater than Zero!");
            return false;
        }
}

function getProductIndex(id)
{
    for(var i=0;i<productsArray.length;i++)
        {
            if(productsArray[i].id==id)
                {
                    return i;
                }
        }
}

function getCartIndex(id)
{
    for(var i=0;i<cart.length;i++)
        {
            if(cart[i].id==id)
                {   
                    if(cart[i].user==username)
                        {
                         return i;
                        }
                }
        }
}

function checkCart(id)
{
    for(var i=0;i<cart.length;i++)
         {
            if(cart[i].id==id)
                {
                    if(cart[i].user==username)
                        return true;
                }
          }
   return false;
}

function checkQuantityAvailability(id,value)
{
    console.log(value);
      var index=getProductIndex(id);
     console.log(productsArray[index].quantity);
      if(productsArray[index].quantity>=Number(value))
          {
              return true;
          }
     else
         {
             alert("Quantity not in stock");
             return false;
         }
}

function addProductToDOM(productObj)
{
    var str="<h4><b>"+productObj.name+"</b></h4>Description : "+productObj.description+"<br>Price : Rs "+productObj.price+"<br>";
        var divRow=document.createElement("div");
        divRow.className+="productDiv";
        var img = document.createElement('img');
        img.setAttribute("style","margin-left:17%;");
        var path=productObj.img;
        img.src="images/"+path;
        divRow.appendChild(img);
        divRow.setAttribute("id",productObj.id);
        var product=document.createElement("p");
        product.innerHTML=str;
        divRow.appendChild(product);
        if(username=="")
            {
                var quantity=document.createElement("input");
                quantity.setAttribute("placeholder"," You need to Login First!!!");
                quantity.setAttribute("type","number");
                quantity.setAttribute("disabled","true");
                quantity.setAttribute("style","outline:none;border:none;border-bottom:1px solid black;background:none;");
            }
        else if(Number(productObj.quantity)<=0)
        {
          var quantity=document.createElement("input");
            quantity.setAttribute("placeholder"," OUT OF STOCK!!!");
            quantity.setAttribute("type","number");
            quantity.setAttribute("disabled","true");
            quantity.setAttribute("style","outline:none;border:none;border-bottom:1px solid black;background:none;");
        }
        else
        {
            var quantity=document.createElement("input");
            quantity.setAttribute("placeholder"," quantity");
            quantity.setAttribute("type","number");
            quantity.setAttribute("style","outline:none;border:none;border-bottom:1px solid black;background:none;");
        }
        var addToCart=document.createElement("button");
        addToCart.innerHTML="Add to cart";
        addToCart.setAttribute("style","padding:4px 8px;margin-left: 20px;background-color: grey;border:none;");
        addToCart.addEventListener("click",function(event) {
            if(checkValidation(quantity.value))
                {
                    if(checkQuantityAvailability(divRow.id,quantity.value))
                        {
                                    if(checkCart(divRow.id))
                                        {
                                    var index=getCartIndex(divRow.id);
                                    var obj=new Object();
                                    obj.user=username;
                                    obj.id=divRow.id;
                                    obj.name=productObj.name;
                                    obj.quantity=quantity.value;
                                    obj.price=productObj.price;
                                    obj.img=productObj.img;
                                    obj.total=Number(productObj.price)*Number(quantity.value);
                                    cart.splice(index,1,obj);
                                    updateDatabase(obj,divRow.id);
                                    alert("Product added!");
                                    console.log(cart); 
                                        }
                                   
                            else
                                        {
                                    var obj=new Object();
                                    obj.user=username;
                                    obj.id=divRow.id;
                                    obj.name=productObj.name;
                                    obj.quantity=quantity.value;
                                    obj.price=productObj.price;
                                    obj.img=productObj.img; obj.total=Number(productObj.price)*Number(quantity.value);
                                    cart.push(obj);
                                    storeProducts();
                                    alert("Product added!");
                                    console.log(cart);
                                        }
                        }
                    
                }
            quantity.value="";
        });
        divRow.appendChild(quantity);
        divRow.appendChild(addToCart);  divRow.setAttribute("style","overflow:hidden;height:60%;width:100%;float:left;margin-left:25px;width:340px;padding:10px 20px;margin-top:40px;");
        divListOfProducts.appendChild(divRow);
        console.log(divRow.id);
        console.log(productsArray);
        
}