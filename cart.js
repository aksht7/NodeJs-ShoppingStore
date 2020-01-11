var user=[]
var allProducts=[];
var productsArray=[];
var userCartProducts=[];
var allOrders=[];
var grant=1;
var username;
var total=document.getElementById("total");
var divListOfProducts=document.getElementById("divListOfProducts");
var totalPrice=0;
function getUserInfo(){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            username=this.responseText;
            getStoredProducts();
        }
    }
  xhttp.open("GET", "/getUserInfo", true);
  xhttp.send();
}

function getAllProducts()
{
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200)
    {
    allProducts=JSON.parse(this.responseText);
        console.log(allProducts);
    }
  }
  xhttp.open("GET", "/array", true);
  xhttp.send();
}

function getStoredProducts()
{
    username=username.slice(1,user.length-1);
    getAllProducts();
    console.log(username);
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200)
    {
    console.log(allProducts);
    productsArray=JSON.parse(this.responseText);
    for(i=0;i<productsArray.length;i++)
    {
        if(productsArray[i].user==username)
        {
        userCartProducts.push(productsArray[i]);    
        addProductToDOM(productsArray[i]);
        }
    }
    console.log("User Cart :"+userCartProducts);
    productId=productsArray[i-1].id+1;
    total.innerHTML=total.innerHTML+totalPrice;
    }
  }
  xhttp.open("GET", "/cartProducts", true);
  xhttp.send();
}

function storeProducts()
{
    localStorage.cartProducts=JSON.stringify(productsArray);
}

function removeDataFromProductArray(index)
{
   productsArray.splice(index,1);
   storeProducts();
}

function getProductIndex(id)
{
    for(var i=0;i<productsArray.length;i++)
        {
            if(productsArray[i].user==username)
            {
            if(productsArray[i].id==id)
                {
                     return i;
                }
            }
        }
}

function getAllProductIndex(id)
{
    for(var i=0;i<allProducts.length;i++)
        {
            if(allProducts[i].id==id)
                {
                    return i;
                }

        }
}
function deleteListRows(id,element)
{
    var index=getProductIndex(id);
    totalPrice=totalPrice-(Number(productsArray[index].quantity)*Number(productsArray[index].price));
    console.log(id);
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
          console.log("deleted");
        }
    };
    xhttp.open("POST","/deleteFromCart",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("ids="+JSON.stringify(id)+"&username="+JSON.stringify(username));
    removeDataFromProductArray(index);
    divListOfProducts.removeChild(element);
    location.href='/cart';
}

function deleteProduct(id,element)
{
    var index=getProductIndex(id);
    console.log(index);
    
    removeDataFromProductArray(index);
    divListOfProducts.removeChild(element);
    location.href='/cart';
}

function addProductToDOM(productObj)
{
    console.log(productObj);
    var str="Product name : "+productObj.name+"<br>Price : Rs "+productObj.price+"<br>Quantity : "+productObj.quantity+"<br>Total : Rs "+productObj.total;
    var index=getAllProductIndex(productObj.id);
    var divRow=document.createElement("div");
    var img = document.createElement('img');
        img.setAttribute("style","margin-left:17%;");
        var path=productObj.img;
        img.src="images/"+path;
        divRow.appendChild(img);
    divRow.setAttribute("id",productObj.id);
    var product=document.createElement("p");
    product.innerHTML=str;
    console.log(index);
  if(Number(allProducts[index].quantity)<Number(productObj.quantity))
    {
        product.innerHTML="OUT OF STOCK!!!"
    }
    divRow.appendChild(product);
    var deleteBtn=document.createElement("button");
    deleteBtn.innerHTML="Delete";
    deleteBtn.setAttribute("style","margin-left: 20px;background-color: white;color: black;border: 2px solid #555555;");
    divRow.appendChild(deleteBtn);
    deleteBtn.addEventListener("click",function(event) {
        deleteListRows(divRow.id,divRow);
    });
    divRow.setAttribute("style","float:left;margin-left:25px;width:340px;padding:10px 20px;margin-top:20px;");
    divListOfProducts.appendChild(divRow);
    totalPrice+=Number(productObj.price)*Number(productObj.quantity);

}

function checkQuantityAvailability()
{
    for(i=0;i<userCartProducts.length;i++)
        {
            for(j=0;j<allProducts.length;j++)
                {
                    var index=getAllProductIndex(userCartProducts[i].id);
                    console.log("index "+index);
                    if(Number(allProducts[index].quantity)<Number(userCartProducts[i].quantity))
                        {
                            grant=0;
                        }
                }
        }
    console.log(grant);
    return grant;
}

function checkOut()
{
    if(checkQuantityAvailability())
        {
    refreshQuantity();
    location.href='/cart';
}
    else
        {
         alert("The product is OUT OF STOCK!!! please remove it");
        }
}

function continueToShop()
{
    location.href='/';
}
function updateDatabase(id,productObj){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log("updated");
    }
  };
  xhttp.open("POST", "/updateDatabase", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("product="+JSON.stringify(productObj)+"&id="+JSON.parse(id));
}

function deleteCartProducts()
{
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log("deleted");
    }
  };
  xhttp.open("POST", "/deleteCartProduct", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+JSON.stringify(username));
}

function refreshQuantity()
{
    for(i=0;i<userCartProducts.length;i++)
        {
            var index=getAllProductIndex(userCartProducts[i].id);
            console.log(index);
            allProducts[index].quantity=allProducts[index].quantity-userCartProducts[i].quantity;
        }
    console.log(allProducts);
    for(i=0;i<allProducts.length;i++)
    {
    updateDatabase(allProducts[i].id,allProducts[i]);
    }
    deleteCartProducts();
    console.log("DONE");
}

function placeOrder()
{
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      console.log("updated");
    }
  };
  xhttp.open("POST", "/allOrders", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("AllOrders="+JSON.stringify(productObj));
}
