const resetPizzaMenuForm=document.querySelector('#resetForm');
const resetIngredientForm=document.querySelector('#resetIngredientForm');
////////////////////////////////////////

const form=document.querySelector('#pizzaToFind');
const pizzaNameInput=document.querySelector('#pizzaName');
const foundPizzaMsg=document.querySelector('#foundPizza');

 /////////////////////////////////////////
const updatedPizzaNameInput=document.querySelector('#updatedPizzaName');
const updatedPizzaNameLabel=document.querySelector('#updatedPizzaNameLabel');
const smallPriceLabel=document.querySelector('#smallPriceLabel');
const smallPriceInput=document.querySelector('#smallPrice');
const largePriceLabel=document.querySelector('#largePriceLabel');
const largePriceInput=document.querySelector('#largePrice');
const ingredientsLabel=document.querySelector('#ingredientsLabel');
const ingredientsTextArea=document.querySelector('#ingredientsTextArea');




const updateBtn=document.querySelector('#update-btn');
const cancelBtn=document.querySelector('#cancelBtn');

const createPizzaForm=document.querySelector('#createPizza');
const resultDiv=document.querySelector('#result');
const findIngredientForm=document.querySelector('#findIngredientForm');
const updateIngredientResult=document.querySelector('#updateIngredientResult');
const findIngredientInput=document.querySelector('#findIngredient');
const inputMessage=document.querySelector('#inputMessage');
const updateIngredientBtn=document.querySelector('#updateIngredientBtn');
const labelIngredient=document.querySelector('#labelIngredient');



///////////////////////
const ingredientToDeleteInput=document.querySelector('#ingredientToDelete');
const ingredientToDeleteMsg=document.querySelector('#ingredientToDeleteMsg');
const deleteIngredientBtn=document.querySelector('#deleteIngredientBtn');
 const ingredientToDeleteForm=document.querySelector('#ingredientToDeleteForm');
 /////////////////////

 const createIngredientForm=document.querySelector('#createIngredientForm');
 const actualBtn = document.getElementById('pizzaImage');
 const fileChosen = document.getElementById('file-chosen');
 actualBtn.addEventListener('change', function(){
    fileChosen.textContent = this.files[0].name;
  });
///////////////////////////////

const deletePizzaForm=document.querySelector('#deletePizza');
const pizzaNameDeleteInput=document.querySelector('#deletePizzaName');
const deleteMsg=document.querySelector('#deleteMsg');
const deleteBtn=document.querySelector('#deleteBtn');

/////////////////////////////////

resetPizzaMenuForm.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();
const confirmed=confirm('Are you sure you want to reset the menu to initial state? This cannot be undone.')
if(confirmed){
    const response=await fetch('/gema/import',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({})
    });
    const result=await response.json();
    
    if(!response.ok){
        alert('SERVER ERROR:',result.message);
    }else{
        alert('Pizza menu is reset successfully!!!😋')
    }
    
        }

    
}catch(err){
    alert('NETWORK ERROR:',err.message)
}



})


///////////////////////////////////

resetIngredientForm.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();
        const confirmed=confirm('Are you sure you want to reset the extra ingredients into the initial state? This cannot be undone.')
        if(confirmed){
            const response=await fetch('/gema/importAllIngredients',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({})
            });
            const result=await response.json();
            
            if(!response.ok){
                alert('SERVER ERROR:',result.message);
            }else{
                alert('Extra Ingredients are reset successfully!!!😋')
            }

        }


    }catch(err){
        alert('NETWORK ERROR:',err.message)
    }


})


////////////////////////////////////////
let debouncer4;
let dataBackup=null;

pizzaNameDeleteInput.addEventListener('input',()=>{
    clearTimeout(debouncer4);
    const pizzaNameDeleteInputValue=pizzaNameDeleteInput.value.trim();
if(!pizzaNameDeleteInputValue){
deleteMsg.textContent='';
return;
}

debouncer4=setTimeout(async()=>{
    try{
const response=await fetch(`/gema/findPizza?name=${pizzaNameDeleteInputValue}`,{
        method:"GET",
        headers:{'Content-Type':'application/json'}
    })

    const result=await response.json();
    if(!response.ok){
deleteMsg.textContent='There is no such Pizza';
deleteMsg.style.color='red';
deleteBtn.disabled=true;
setTimeout(()=>{
    pizzaNameDeleteInput.classList.add('shake');
},400);
pizzaNameDeleteInput.classList.remove('shake');


        // alert('SERVER ERROR: ',result.message)
    }else{
dataBackup=result.data;
deleteMsg.textContent='Pizza found!';
deleteMsg.style.color='green';
deleteBtn.disabled=false;

// alert(`Pizza ${dataBackup.name} ready to be deleted!`)


    }

    }
    catch(err){
        alert('NETWORK ERROR:',err.message);
    }
})

})

deletePizzaForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
const confirmed=confirm('Are you sure you want to delete this pizza?This cannot be undone.')
if(confirmed){
    const response=await fetch('/gema/deletePizza',{
        method:"DELETE",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({dataBackup})
    
 })

 const result=await response.json();

 if(!response.ok){
    alert('SERVER ERROR: ',result.message)
 }else{
    deleteBtn.disabled=true;
    deleteMsg.textContent='';
    deleteMsg.style.color='';
    pizzaNameDeleteInput.value='';
    pizzaNameDeleteInput.style.color='';
pizzaNameDeleteInput.classList.remove('shake');


    alert(`Pizza successfuly deleted!`);


 }

}
    



})


let backupData3=null;
let debouncer3;
pizzaNameInput.addEventListener('input',()=>{
    
        clearTimeout(debouncer3);
        const pizzaNameInputValue=pizzaNameInput.value.trim();
if(!pizzaNameInputValue){
    foundPizzaMsg.textContent='';
    updateBtn.disabled=true;
    return;
}


try{
    debouncer3=setTimeout(async()=>{



        const response=await fetch(`/gema/findPizza/?name=${pizzaNameInputValue}`,{
            method:'GET',
            headers:{'Content-Type':'application/json'}
        })
                
        const result=await response.json();
        if(!response.ok){
            // alert('SERVER ERROR: ',result.message);
        foundPizzaMsg.textContent='We dont have such a pizza';
        foundPizzaMsg.style.color='red';
        updateBtn.disabled=true;
        setTimeout(()=>{
            pizzaNameInput.classList.add('shake')
        },300);
        pizzaNameInput.classList.remove('shake');
        
        
        }else{
            backupData3=result.data;
            foundPizzaMsg.textContent='Pizza found!';
            foundPizzaMsg.style.color='green';
    pizzaNameInput.style.color='';
    pizzaNameInput.classList.remove('shake');


            updateBtn.disabled=false;
        
            // alert(`${pizzaNameInputValue} found!`);
        }
    
    },400);
    
    }catch(err){
        alert('NETWORK ERROR:',err.message)
    }

}

)

form.addEventListener('submit',async(e)=>{
try{
e.preventDefault();
const updateData={
    name:updatedPizzaNameInput.value.toUpperCase() || backupData3.name,
    prices:{
        large:Number(largePriceInput.value) || backupData3.prices.large,
        small:Number(smallPriceInput.value) || backupData3.prices.small
    },
    ingredients:ingredientsTextArea.value.trim() ||backupData3.ingredients
}
const id=backupData3._id;

const response=await fetch(`/gema/updatePizza/?name=${backupData3.name.toUpperCase()}`,{
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id,updateData})
})

const result=await response.json();

if(!response.ok){
    alert('SERVER ERROR: ',result.message)
}else{
    foundPizzaMsg.textContent='';
    foundPizzaMsg.style.color='';
    pizzaNameInput.value="";
    updatedPizzaNameInput.value="";
    largePriceInput.value='';
    smallPriceInput.value='';
    ingredientsTextArea.value='';
    updateBtn.disabled=true;


    alert(`${result.data.name} is updated`);
resultDiv.innerHTML='';
    const html=`
        <div class="updated-pizza-card">
    
    <img class="updated-pizza-img" src="/img/${result.data.image}" alt="${result.data.name}" >
    <h2>${result.data.name}</h2>
    <p>(${result.data.ingredients.join(', ')})</p>
    <p><strong>Price: large ${result.data.prices.large}€, small ${result.data.prices.small}€</strong></p>
    <p>${result.data.active ? '': 'Sold Out'}</p>
    </div>
    `;
resultDiv.insertAdjacentHTML('beforeend',html);
}

}
catch(err){
    console.log('NETWORK ERROR:',err.message)
    alert('NETWORK ERROR: ',err.message)
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
resultDiv.innerHTML='';
document.querySelector('#newPizzaName').value='';
document.querySelector('#newSmallPrice').value='';
document.querySelector('#newLargePrice').value='';
document.querySelector('#newIngredients').value='';
fileChosen.textContent='';
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




let debouncer;
let backupData=null;
findIngredientInput.addEventListener('input', ()=>{
clearTimeout(debouncer);

const ingredient=findIngredientInput.value.trim();

if(!ingredient){
    inputMessage.textContent='';
    updateIngredientBtn.disabled=true;
    return;
}

debouncer=setTimeout(async()=>{
    try{
        const response=await fetch(`/gema/findIngredient?item=${ingredient}`,{
            method:'GET',
            headers:{'Content-Type':'application/json'}
        })
        const result=await response.json();
    
        if(response.ok && result.data){
            inputMessage.textContent='Ingredient exist';
            inputMessage.style.color='green';
            backupData=result.data;
            
            labelIngredient.textContent=`Change ${ingredient} to :`
            
            updateIngredientBtn.disabled=false;
        }else{
            
            inputMessage.textContent='There is no such ingredient';
            inputMessage.style.color='red';
            updateIngredientBtn.disabled=true;
            findIngredientInput.classList.add('shake');

            setTimeout(()=>{
                findIngredientInput.classList.remove('shake');
                
            },300)
        }
    }

   catch(err){
    console.log('error:',err.message)
   }

},400)

})

//AND HERE I WILL TAKE THE INFO FROM THE FORM:
findIngredientForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
const ingredient=findIngredientInput.value.trim();
const dataToUpdate={
    item:document.querySelector('#newIngredient').value.toUpperCase() || backupData.item,
    unit:document.querySelector('#unit').value || backupData.unit,
    price:Number(document.querySelector('#price').value)==='' ? Number(backupData.price):Number(document.querySelector('#price').value)
}
    try{
const response=await fetch(`/gema/updateIngredient?item=${ingredient}`,{
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dataToUpdate})
})
const result=await response.json();
if(!response.ok){
    console.log('there is an error',result)
}else{
    
    console.log('the result data:',result.data)
    updateIngredientResult.innerHTML='';
    findIngredientInput.value="";
    document.querySelector('#newIngredient').value='';
    document.querySelector('#price').value='';
    labelIngredient.innerHTML='Change Ingredient to:'
    const html=`
    <div class='updatedIngredient'>
    <div class='ingredient'>
    <h3>${result.data.item}(${result.data.unit}):${result.data.price.toFixed(2)}€</h3>
    
    </div>
    <a href='/gema/menu'>
    <button id='mainPagebtn'  type='button'>Take me to main page</button>
    </a>
    </div>
    
    `
    updateIngredientResult.insertAdjacentHTML('beforeend',html)
    
    alert('The ingredient is updated');
    

}}
    catch(err){
        console.log('there is an error :',err)// so this is the network error for frontend
    }
})

////////////////////////////////////////

let debouncer2;
let backupData2=null;

ingredientToDeleteInput.addEventListener('input',()=>{

try{

    clearTimeout(debouncer2);

    const ingredientValue=ingredientToDeleteInput.value.trim().toUpperCase();
    
    if(!ingredientValue){
        ingredientToDeleteMsg.textContent='';
        deleteIngredientBtn.disabled=true;
    }
    
    debouncer2=setTimeout(async()=>{
    
        const response=await fetch(`/gema/findIngredient?item=${ingredientValue.toUpperCase()}`,{
            method:'GET',
            headers:{'Content-Type':'application/json'}
        });
        
        const result= await response.json();
        
        if(!response.ok){
            console.log('Server Error:',result.message);
        ingredientToDeleteMsg.textContent='Couldnt find the ingredient to delete';
        ingredientToDeleteMsg.style.color='red';
        setTimeout(()=>{
            ingredientToDeleteInput.classList.add('shake')
        },300)
        ingredientToDeleteInput.classList.remove('shake');
    }else{
            ingredientToDeleteInput.classList.remove('shake');
            ingredientToDeleteInput.style.borderColor = '';
            backupData2=result.data;
            ingredientToDeleteMsg.textContent='Found the ingredient to delete!';
            ingredientToDeleteMsg.style.color='green';
            deleteIngredientBtn.disabled=false;
            // alert(`  ${ingredientValue} is ready to be deleted !!!`)

        }
    
    
    
    },400)

}catch(err){
    console.log('this is error from the network:',err.message)
}






})

////////////////////////////////////////////////

ingredientToDeleteForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
const confirmed=confirm('Are you sure you want to delete this ingredient?This cannot be undone.');
if(confirmed){
    try{ 
        const response=await fetch(`/gema/findIngredientToDelete/?item=${backupData2.item.toUpperCase()}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'}
    })
    const result=await response.json();
    if(!response.ok){
        console.log('Server error:',result.message)
    }else{
        ingredientToDeleteMsg.innerHTML='';
        ingredientToDeleteInput.value='';
        ingredientToDeleteInput.classList.remove('shake');
        deleteIngredientBtn.disabled = true;

        alert(`The ${backupData2.item} is deleted succesfuly`)
    }


}catch(err){
    console.log('Network Error: ',err.message)
}


}

   
   
})

//////////////////////////////////////////////////////

createIngredientForm.addEventListener('submit',async(e)=>{

try{



    e.preventDefault();
    
    const dataToUse={
        item:document.querySelector('#createIngredient').value.toUpperCase(),
        unit:document.querySelector('#createUnit').value==='' ? 'porcija' : document.querySelector('#createUnit').value,
        price:  document.querySelector('#createPrice').value===''? undefined : Number(document.querySelector('#createPrice').value) 
    };
    
    const response=await fetch('/gema/createIngredient',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dataToUse})
    });
    
    const result=await response.json();
    if(!response.ok){
    alert(`SERVER ERROR: ${result.message}`)

    }else{
    
    alert('One Ingredient was created successfully!')
    
    const html=`
    <div class='updatedIngredient'>
    <div class='ingredient'>
    <h3>${result.data.item}(${result.data.unit}):${result.data.price.toFixed(2)}€</h3>
    
    </div>
    <a href='/gema/menu'>
    <button id='mainPagebtn'  type='button'>Take me to main page</button>
    </a>
    </div>
    `
    updateIngredientResult.insertAdjacentHTML('beforeend',html);
    ///clean all inputs:
    document.querySelector('#createIngredient').value='';
    document.querySelector('#createUnit').value='';
    document.querySelector('#createPrice').value=''
    }
}catch(err){
    console.log('NETWORK ERROR: ',err.message)
}



})

document.querySelectorAll('*').forEach(el => {
    if (el.offsetWidth > document.documentElement.offsetWidth) {
        console.log('Found it! This element is too wide:', el);
        el.style.outline = '2px solid red';
    }
});