document.addEventListener("DOMContentLoaded", ()=>{
    const signupForm = document.getElementById("signup-form");
    const output = document.getElementById("output");

    signupForm.addEventListener("submit",async (event)=>{
        event.preventDefault();
        const usernameValue = document.getElementById("email").value;
        const fullNameValue = document.getElementById("fullName").value;
        const passwordValue = document.getElementById("password").value;
        const result = await signUp(
            usernameValue,
            fullNameValue,
            passwordValue
        );
        if("Conflict" === result){
            output.innerText = "Username already taken.";
            return;
        }
        //SUCCESS
        window.location.href = "login.html";
    });//end click
}); //end loaded