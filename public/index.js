const pizzaContainer=document.getElementById('pizza-container');
document.getElementById("year").innerHTML = new Date().getFullYear();
const extraIngredientContainer=document.querySelector('#extraIngredient-container');
const orderBtns=document.querySelectorAll('.order-btn');
const basket=document.getElementById('basket');
//////////////////////////////////
const checkAuth = async () => {
    try {
        const response = await fetch('/user/getMe',{
            method:'GET',
            headers:{'Content-type':'application/json'},
            credentials:'include'
        });
        
        if(response.status===401)return false;
        
        const result = await response.json();


        if (response.ok) {
            // User is logged in! 
            // Now you can find your buttons and show them
            console.log(`Authenticated as: ${result.data.user.name}`);
            return true;
        }
        
        else{
            return false;
        }
    } catch (err) {
        // Not logged in, keep buttons hidden
        return false;
    }
};

const displayPizzas = async () => {
    try {
        const isLoggedIn = await checkAuth();
        const response = await fetch('/gema/showPizzas');
/////////////////////////////////
//trying to display the cart properly:



if(isLoggedIn){
    const response1=await fetch('/user/order',{
        method:'GET',
        headers:{'Content-Type':'application/json'},
        credentials:'include'
    })
    
    const resultBasket=await response1.json();
    const data=resultBasket.data;

    if(!response1.ok){
        basket.classList.remove('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
        basket.style.backgroundColor='transparent';
        console.log('There is nothing yet in the basket',resultBasket);
    }else if(response1.ok){
        if(data.items.length>0){

            basket.classList.add('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
            basket.style.backgroundColor='red';
        }
}
       
    
        }
        
    



//////////////////////////////////////////////








        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const pizzas = result.data.pizzas;
        
        pizzaContainer.innerHTML = '';
        
        pizzas.forEach(pizza => {
            // Check if user is logged in AND pizza is active to show button
            const orderButton = (isLoggedIn && pizza.active) 
                ? `<button type="button" class="order-btn" data-id="${pizza._id}">Order Now</button>` 
                : '';

            const html = `
                <div class="pizza-card" data-id="${pizza._id}"  data-name="${pizza.name}"  data-smallPrice="${pizza.prices.small}" data-largePrice="${pizza.prices.large}" >
                    <img src="/img/${pizza.image}" alt="${pizza.name}" class="pizza-img">
                    <h2>${pizza.name}</h2>
                    <p>(${pizza.ingredients.join(', ')})</p>
<div class="radioContainers">

                    <input type="radio" name="price${pizza._id}" id="small${pizza._id}"  value="small" checked>
                    <label class="radioLabel" for="small${pizza._id}" >Small Price:${pizza.prices.small}€</label>
</div>
<div class="radioContainers">

                     <input type="radio" name="price${pizza._id}" id="large${pizza._id}"  value="large">
                    <label class="radioLabel" for="large${pizza._id}" >Large Price:${pizza.prices.large}€</label>
</div>


                    <p>${pizza.active ? '' : '<strong>Sold Out</strong>'}</p>
                    ${orderButton}
                </div>
            `;
            pizzaContainer.insertAdjacentHTML('beforeend', html);
        });
    } catch (err) {
        console.log('Frontend Error:', err);
        pizzaContainer.innerHTML = `<p>Something went wrong.</p>`;
    }
};


/*
                     <p><strong>Cijena: velika ${pizza.prices.large}€, mala ${pizza.prices.small}€</strong></p>

*/



const displayExtraIngredients=async()=>{
    try{
const response=await fetch('/gema/showAllIngredients')
const result=await response.json();
if(!response.ok){
    throw new Error('Couldnt display any ingredient')
}   
const ingredients=result.data;



ingredients.forEach(ingredient=>{
    const html=`<div class='ingredient'>
    <h3>${ingredient.item}(${ingredient.unit}):${ingredient.price.toFixed(2)}€</h3>
    
    </div>`
    extraIngredientContainer.insertAdjacentHTML('beforeend',html)

})






    }
    catch(err){
        console.log('Error:',err.message)
    }
}


document.addEventListener('DOMContentLoaded',()=>{

    displayPizzas();
    
    displayExtraIngredients();
    pizzaContainer.addEventListener('click', async (e)=>{
        
    if(e.target.classList.contains('order-btn')){
    
        const productCard=e.target.closest('.pizza-card');
        const productId=productCard.dataset.id;
        const size=document.querySelector(`input[name="price${productCard.dataset.id}"]:checked`).value;
    
    try{
    const response=await fetch('/user/order',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:"include",
        body:JSON.stringify({productId,size})
    })
    
    const result= await response.json();
    if (response.ok){
        basket.classList.add('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
        basket.style.backgroundColor='red';
        alert('Pizza added to cart!');
    
    }else{
         // Handle server-side errors (e.g., 500, 400, 404)
         alert(`Failed to add pizza: ${result.message}. Please try again.`);
    }
    
    }
    catch(err){
        // alert('Couldnt send the order because:',err.message)
        // This catch block handles network errors (e.g., server down, no internet)
        alert(`Could not send the order because: ${err.message}. Check your network connection.`);
        console.error('Network error:', err);
    }
    
        
    }
    
    })
})


///////////////////////////////////////


