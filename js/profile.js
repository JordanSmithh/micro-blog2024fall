// /api/users/{username}


document.addEventListener("DOMContentLoaded", function () {
    const userToken = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const logoutButton = document.getElementById("logout-btn");
    const updateForm = document.getElementById("profile-form");

    function displayUserData(userData){
        if(userData) {
            const userDataEl = document.getElementById("userdata");
            userDataEl.innerHTML = `
                <h3>${userData.username}</h3>
                <p>${userData.bio}</p>
            `;
        }
    }

    // function to fetch user information
    async function getUserData() {

        const response = await fetch(BASE_URL + "/api/users/"+username, {
            method: "GET",
            headers: headersWithAuth(),
        }); //end fetch

        //TODO check for error response status codes
        if (response.status != 200) {
            console.log(response.status, response.statusText);
            return response.statusText;
        }
        const object = await response.json(); //COnvert body to object
        displayUserData(object);
    }

    getUserData();


    logoutButton.addEventListener("click", function () {

        if (userToken && username) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");

            alert("User logged out successfully");

            window.location.href = "index.html";
        } else {
            alert("User is not logged in");
        }
    })

    updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fullNameValue = document.getElementById("fullName").value;
        const passwordValue = document.getElementById("password").value;
        const bioValue = document.getElementById("bio").value;

        const payload = JSON.stringify({ "password": passwordValue, "bio": bioValue, "fullName": fullNameValue });

        const response = await fetch(
            BASE_URL + "/api/users/" + username, {
            method: "PUT",
            headers: headersWithAuth(),
            body: payload
        });
        const object = await response.json();
        if(object.fullName) {
            alert("User data updated successfully")
            window.location.reload();
        }
    })

})