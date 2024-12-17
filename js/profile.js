document.addEventListener("DOMContentLoaded", function(){

    const logoutButton = document.getElementById("logout-btn");

    logoutButton.addEventListener("click", function() {
        const userToken = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if(userToken && username) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");

            alert("User logged out successfully");

            window.location.href="index.html";
        } else {
            alert("User is not logged in");
        }
    })

})