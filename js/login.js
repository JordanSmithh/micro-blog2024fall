document.addEventListener("DOMContentLoaded", ()=>{
    const loginForm = document.getElementById("login-form");
    const output = document.getElementById("output");

    loginForm.addEventListener("submit",async (event)=>{
        event.preventDefault();

        const usernameValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("password").value;

        const result = await login(
            usernameValue,
            passwordValue
        );
        // debugger;
        if(!result || !result.hasOwnProperty("statusCode") || result.statusCode != 200){
            output.innerText = "Login Failed";
            return;
        }
        //SUCCESS
        window.location.href = "messages.html";
    });//end click
}); //end loaded