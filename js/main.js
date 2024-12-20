const modeButton = document.getElementById("modebutton");
const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
const NO_AUTH_HEADERS = { 'accept': 'application/json', 'Content-Type': 'application/json' };
// ONLY 2 - INSECURE TOKEN FREE ACTIONS

//create user - sign up
/*
curl -X 'POST' \
  'http://microbloglite.us-east-2.elasticbeanstalk.com/api/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "string",
  "fullName": "string",
  "password": "string"
}'
*/
async function signUp(username, fullName, password) {
    const payload = JSON.stringify(
        { "username": username, "fullName": fullName, "password": password }
    );

    const response = await fetch(BASE_URL + "/api/users", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); //end fetch

    //TODO check for error response status codes
    if (response.status != 201) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); //COnvert body to object
    console.log(object, "data from api for signup")
    return object;
}


//login and store username and token received
/*
curl -X 'POST' \
  'http://microbloglite.us-east-2.elasticbeanstalk.com/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "string",
  "password": "string"
}'
*/
async function login(username, password) {
    const payload = JSON.stringify({ "username": username, "password": password });
    const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); //end fetch

    //TODO check for error response status codes
    if (response.status != 200) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); //COnvert body to object
    console.log(object, "data from api for login")
    localStorage.token = object.token;
    localStorage.username = object.username;

    getSpotifyToken();

    return object;
}

// ALL THE OTHERS NEED A TOKEN IN THE HEADER
function headersWithAuth() {
    //SAME AS NO AUTH BUT WITH AUTH ADDED
    return { 
        ...NO_AUTH_HEADERS, 
        'Authorization': `Bearer ${localStorage.token}`,
    }
}

async function getSpotifyToken(){
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: 'POST',
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'f33f7fd0123043d78ed13e55aebf3e5c',
            client_secret: '62c433fe30fa4b02b9af38c9f2028c0d'
          })
        });
      
        if (response.ok) {
          const result = await response.json();
          if(result.access_token) {
            localStorage.setItem("spotify_token", result.access_token)
          }
          console.log(result);
        }
      } catch (err) {
        console.error(err);
      }
}

function headersWithAuthSpotify() {
    return { 
        'Authorization': `Bearer ${localStorage.spotify_token}`,
    }
}

// get secure list of message using token
async function getMessageList() {
    const LIMIT_PER_PAGE = 1000;
    const OFFSET_PAGE = 0;
    const queryString = `?limit=${LIMIT_PER_PAGE}&offset=${OFFSET_PAGE}`;

    const response = await fetch(
        BASE_URL + "/api/posts" + queryString, {
        method: "GET",
        headers: headersWithAuth(),
    });
    const object = await response.json();
    return object;
}


modeButton.addEventListener("click", function(){
    if(!document.body.classList.contains("dark")) {
        document.body.classList.add("dark")
        modeButton.innerHTML = `
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-toggle-right"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg><span>Light Mode</span>
        `
    } else {
        document.body.classList.remove("dark")
        modeButton.innerHTML = `
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-toggle-left"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle></svg>
        `
    } 
})