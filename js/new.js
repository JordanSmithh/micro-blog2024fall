// /api/users/{username}


document.addEventListener("DOMContentLoaded", function () {
    const newMessageForm = document.getElementById("new-message-form");

    newMessageForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newMessage = document.getElementById("message").value;

        const payload = JSON.stringify({"text": newMessage });

        const response = await fetch(
            BASE_URL + "/api/posts/", {
            method: "POST",
            headers: headersWithAuth(),
            body: payload
        });
        const object = await response.json();
        if(object._id) {
            alert("new post added successfully")
            window.location.href= "messages.html";
        } else {
            alert("Error adding the new post");
        }
    })

})