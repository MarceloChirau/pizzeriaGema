const pizzaContainer=document.getElementById('pizza-container');
document.getElementById("year").innerHTML = new Date().getFullYear();
const extraIngredientContainer=document.querySelector('#extraIngredient-container');

const displayPizzas=async()=>{
    try{
const response=await fetch('/gema/showPizzas');
if(!response.ok){
    throw new Error(`HTTP error, status: ${response.status}`);
}
const result=await response.json();
const pizzas=result.data.pizzas;
// console.log('my pizzas:',pizzas);

pizzaContainer.innerHTML = '';

pizzas.forEach(pizza=>{
    const html=`
    
    <div class="pizza-card">
    <img src="/img/${pizza.image}" alt="${pizza.name}" class="pizza-img">
    <h2>${pizza.name}</h2>
    <p>(${pizza.ingredients.join(', ')})</p>
    <p><strong>Cijena: velika ${pizza.prices.large}€, mala ${pizza.prices.small}€</strong></p>
    <p>${pizza.active ? '': 'Sold Out'}</p>
    </div>
    
    `;
pizzaContainer.insertAdjacentHTML('beforeend',html);
// pizzaContainer.appendChild(html);

})


    }
    catch(err){
        console.log('there is an error in frontend:',err);
        pizzaContainer.innerHTML=`<p>Something went wrong. Please try again later.</p>`;

    }
}
displayPizzas();

const displayExtraIngredients=async()=>{
    try{
const response=await fetch('/gema/showAllIngredients')
const result=await response.json();
if(!response.ok){
    throw new Error('Couldnt display any ingredient')
}   
console.log('this is the result:',result.data)
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
displayExtraIngredients();