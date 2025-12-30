const pizzaContainer=document.getElementById('pizza-container');

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
    <img src="img/${pizza.image}" alt="${pizza.name}" class="pizza-img">
    <h2>${pizza.name}</h2>
    <p>(${pizza.ingredients.join(', ')})</p>
    <p><strong>Price: large ${pizza.prices.large}€, small ${pizza.prices.small}€</strong></p>
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