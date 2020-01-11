var userRegistered=[];
var loggedUser=[];
var flag=0;
function storeLoggedUser()
{
    sessionStorage.loggedUsers=JSON.stringify(loggedUser);
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
function matchValues()
{
  var uname=document.getElementById("uname").value;
  var password=document.getElementById("password").value;
  for(i=0;i<userRegistered.length;i++)
      {
          
                  location.href="/";
                  flag=1;
              }
      }
}
