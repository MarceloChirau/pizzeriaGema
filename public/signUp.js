const signUpForm=document.getElementById('signUpForm');
const inputName=document.getElementById('name');
const inputPassword=document.getElementById('password');
const inputConfirmPassword=document.getElementById('confirmPassword');
const inputEmail=document.getElementById('email');
const inputPhone=document.getElementById('phone');
const inputAddress=document.getElementById('address');
const submitSignUpBtn=document.getElementById('submitSignUpBtn');
const cancelSignUpBtn=document.getElementById('cancelSignUpBtn');

signUpForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    //effects for submit btn:
    submitSignUpBtn.textContent='Processing...';
    submitSignUpBtn.style.backgroundColor="green";
    submitSignUpBtn.disabled=true;
try{

    const data=new FormData(signUpForm);

    const formValues=Object.fromEntries(data.entries());
    console.log("formValues: ",formValues);
    
    const response= await fetch('/user/signUp',{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(formValues)
    });
    const result=await response.json();
    if(!response.ok){
    throw new Error(result.message||'Something went wrong')
    }
    alert('Welcome to Pizzeria Gema!');
    // Redirect to the home page after 1.5 seconds
    window.setTimeout(() => {
        location.assign('/'); 
    }, 1500);


}catch(err){
    submitSignUpBtn.textContent='SignUp';
    submitSignUpBtn.style.backgroundColor="rgb(0, 72, 255)";
    submitSignUpBtn.disabled=false;
    //clear out all the inputs:
    inputName.value="";
    inputPassword.value='';
    inputConfirmPassword.value=''
    inputEmail.value='';
    inputPhone.value='';
    inputAddress.value='';
    alert(`Error: ${err.message}`);

}

})




