var userRegistered=[];

function storeUserRegistered()
{
    localStorage.users=JSON.stringify(userRegistered);
}

function getRegisteredUser()
{
    if(!localStorage.users)
        {
            localStorage.users=JSON.stringify([]);
        }
    else
        {
            userRegistered=JSON.parse(localStorage.users);            
        }
}

function checkValidation()
{
var name=document.getElementById("name");
var uname=document.getElementById("uname");
var password=document.getElementById("password");
var email=document.getElementById("email");
    if(isAlphabetic(name,"enter a valid name"))
        {
            if(isUnameValid(uname,"enter a valid username (min length:4 & max lentgh:8)"))
                {
                    if(isEmail(email,"enter a valid email"))
                        {
                           var user={
                               name:name.value,
                               uname:uname.value,
                               password:password.value,
                               email:email.value
                           };
                           userRegistered.push(user);
                           console.log(userRegistered);
                           storeUserRegistered();
                           return true; 
                        }
                }
            
        }
    return false;
}

function isAlphabetic(name,msg)
{
    var expr=/^[A-Za-z ]{1,20}$/;
    var isValid=expr.test(name.value);
    console.log(name.value);
    console.log(isValid);
    if(isValid==false)
        {
            name.setCustomValidity(msg);
            return false;
        }
    else
    {
    name.setCustomValidity("");    
    return true;
    }
}

function isUnameValid(uname,msg)
{
    var expr=/^[A-Za-z0-9_]{4,10}$/;
    var isValid=expr.test(uname.value);
    if(isValid==false)
        {
            uname.setCustomValidity(msg);
            return false;
        }
    else
    {    
    uname.setCustomValidity(""); 
    if(checkIfUnameExist())
        {
            return true;
        }
        else
            {
                uname.setCustomValidity("username already exist");
                return false;
            }
        
    }
}

function isEmail(email,msg)
{
    var expr=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var isValid=expr.test(email.value);
    if(isValid==false)
        {
            email.setCustomValidity(msg);
            return false;
        }
    else
    {
    if(checkIfEmailExist())
        {
            return true;
        }
        else
            {
                email.setCustomValidity("email already exist");
                return false;
            }
        
    }
    }

function checkIfUnameExist()
{
    for(i=0;i<userRegistered.length;i++)
        {
            if(uname.value==userRegistered[i].uname)
                {
                    return false;
                }
        }
    return true;
}
function checkIfEmailExist()
{
    for(i=0;i<userRegistered.length;i++)
        {
            if(email.value==userRegistered[i].email)
                {
                    return false;
                }
        }
    return true;
}