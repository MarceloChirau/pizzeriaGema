const form=document.querySelector('#pizzaToFind');
const createPizzaForm=document.querySelector('#createPizza');
const resultDiv=document.querySelector('#result');

const actualBtn = document.getElementById('pizzaImage');
const fileChosen = document.getElementById('file-chosen');

actualBtn.addEventListener('change', function(){
    fileChosen.textContent = this.files[0].name;
  });

/////////to delete:
/* <form class="pizza-form" id="deletePizza">
    <h2>Find Pizza to Delete</h2>
    <label for="deletePizzaName">Pizza-name:</label>
    <input type="text" id="deletePizzaName" autocapitalize="none">
    <button type="submit">Find pizza to delete</button>
</form> */

const deletePizzaForm=document.querySelector('#deletePizza');

deletePizzaForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const pizzaNameInput=document.querySelector('#deletePizzaName');
    const pizzaName=pizzaNameInput.value;

    const response=await fetch(`/gema/findPizza?name=${pizzaName}`,{
        method:"GET",
        headers:{'Content-Type':'application/json'}
    })

const result=await response.json();
if(response.ok){
    alert('Pizza is found and ready for delete!')
    const pizzaId=result.data._id
    pizzaNameInput.value='';

const responseDelete=await fetch('/gema/deletePizza',{
    method:"DELETE",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({_id:pizzaId})

})

const resultDelete=await responseDelete.json();
if(responseDelete.ok){
    alert('The pizza is deleted!')
}else{
    const errorData=await responseDelete.json();
    alert("Error: ",errorData.message)
}


}

})



//this is the main find form could be m,ade also with post method:
form.addEventListener('submit',async (e)=>{
    e.preventDefault();
const pizzaNameInput=document.querySelector('#pizzaName')
const pizzaName=pizzaNameInput.value


const response=await fetch(`/gema/findPizza?name=${pizzaName}`,{
    method:"GET",
    
    headers:{'Content-Type':'application/json'}
    // body:JSON.stringify({name:pizzaName})
})

const result=await response.json();
if (response.ok){
    alert('pizza is found');
    const pizzaId=result.data._id
//clear the input:
pizzaNameInput.value='';

    resultDiv.innerHTML = `
        <form id="updateForm" >
        
        <div class='form-container'>
        <label for="updatedPizzaName" >Editing: ${result.data.name}</label>
            <input type="text" id="updatedPizzaName" placeholder="new pizza name" autocapitalize="none">
        </div>
            

             <div class='form-container'>
        <label for="smallPrice" >Current Price for small pizza: $${result.data.prices.small}</label>
            <input type="number" id="smallPrice" step="any" value="${result.data.prices.small}" placeholder="new price for small pizza" >
        </div>
            


             <div class='form-container'>
        <label>Current Price for large pizza: $${result.data.prices.large}</label>
            <input type="number" id="largePrice" step="any" value="${result.data.prices.large}"  placeholder="new price for large pizza">
        </div>
            


             <div class='form-container'>
        <label for="ingredients" >Current Ingredients:${result.data.ingredients.join(',')}</label>
            <input type="text" id="ingredients" placeholder="new ingredients" autocapitalize="none">
        </div>
            
            <button type="submit" id="save-btn">Update Pizza</button>
            <button type='button' id='cancelBtn' >Cancel</button>



        </form>
    `;


    const cancelBtn=document.querySelector('#cancelBtn');

    cancelBtn.addEventListener('click',()=>{
        resultDiv.style.display='none';  
         resultDiv.innerHTML='';
    })


//connecting the new elements from above:
const updateForm=document.querySelector('#updateForm');

//addEventListener:

updateForm.addEventListener('submit',async(e)=>{
    e.preventDefault();

const dataToUpdate={
    id:pizzaId,
    name:document.querySelector("#updatedPizzaName").value || result.data.name,
    prices:{
        small:document.querySelector('#smallPrice').value || result.data.prices.small,
        large:document.querySelector('#largePrice').value || result.data.prices.large,

    },
    ingredients:document.querySelector('#ingredients').value ?
    document.querySelector('#ingredients').value.split(',').map(i=>i.trim()) :
     result.data.ingredients

};

const newResponse=await fetch('/gema/updatePizza',{
    method:"PATCH",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(dataToUpdate)
})

const newResult=await newResponse.json();

if(newResponse.ok){
    alert('pizza is updated');
const newPizzaUpdated=document.querySelector("#newPizzaUpdated");
resultDiv.innerHTML ="";




// console.log(newResult.data)
newPizzaUpdated.innerHTML=`
<div class="updated-pizza-card">
<img class="updated-pizza-img" src='/img/${newResult.data.image}' alt='${newResult.data.name || result.data.name}'>
<h2>${newResult.data.name || result.data.name}</h2>
<p>Small price:${newResult.data.prices.small}</p>
<p>Large price:${newResult.data.prices.large}</p>
<p>Ingredients:${newResult.data.ingredients.join(',')}</p>
<a href='/gema/menu'>
    <button id='mainPagebtn'  type='button'>Take me to main page</button>
    </a>
</div>
`


}else{
    alert('pizza couldnt update!',newResult.message)
}

})



}else{
    alert('pizza is not found',result.message);
    
}

})

createPizzaForm.addEventListener('submit',async (e)=>{
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.querySelector('#newPizzaName').value);
    formData.append('smallPrice', document.querySelector('#newSmallPrice').value);
    formData.append('largePrice', document.querySelector('#newLargePrice').value);
    formData.append('ingredients', document.querySelector('#newIngredients').value);
    formData.append('image', document.querySelector('#pizzaImage').files[0]); // The file!

    const response = await fetch('/gema/createPizza', {
        method: 'POST',
        body: formData 
    });


    const result=await response.json();
    if(response.ok){
        alert('New pizza is created 🍕🍕🍕');

        resultDiv.innerHTML=`
        <div class="updated-pizza-card">
<img class="updated-pizza-img" src='/img/${result.data.image}' alt='${result.data.name}'>
<h2>${result.data.name }</h2>
<p>Small price:${result.data.prices.small}</p>
<p>Large price:${result.data.prices.large}</p>
<p>Ingredients:${result.data.ingredients.join(',')}</p>
<a href='/gema/menu'>
    <button id='mainPagebtn'  type='button'>Take me to main page</button>
    </a>
</div>
        
        `
    }
})