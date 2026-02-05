const loginForm=document.getElementById('loginForm');
const inputName=document.getElementById('name');
const inputPassword=document.getElementById('password');
const submitLoginBtn=document.getElementById('submitLoginBtn');
const cancelLoginBtn=document.getElementById('cancelLoginBtn');

loginForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
submitLoginBtn.textContent='Processing...';
submitLoginBtn.style.backgroundColor='green';
submitLoginBtn.disabled=true;

try{
    const name=inputName.value;
    const password=inputPassword.value;
    console.log(name);
    console.log(password);

    
    const response=await fetch('/user/logIn',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name,password})
    })
const result=await response.json();

if(!response.ok){
    submitLoginBtn.textContent='submit';
    submitLoginBtn.style.backgroundColor='rgb(0, 72, 255)';
    submitLoginBtn.disabled=false;


    alert(`Error: ${result.message||result.StatusText}`);
    console.log('For my debugging:',result);
}else{
console.log(result.data);
    alert(`Welcome back ${result.data.name}!`);
    window.setTimeout(()=>{
    location.assign('/');
    },1500)
}

}
catch(err){
    alert(`couldnt login because  ${err.message}`)
    console.log('ERROR:',err);
}




})