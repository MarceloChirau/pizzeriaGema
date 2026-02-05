const cartContainer=document.querySelector('.cartContainer');
const totalAmount=document.getElementById('totalAmount');
const checkoutBtn=document.querySelector('.checkoutBtn');
const basket=document.getElementById('basket');


const fetchAndDisplayCart=async()=>{
try{


    const response=await fetch('/user/order',{
        method:'GET',
        headers:{'Content-Type':'application/json'},
        credentials:'include'
    })
    
    const result=await response.json();
    
    if(!response.ok){
        alert(`Can't show any products because ${result.message}`);
        console.log(result);
    }else{
    const cart=result.data;
    console.log(cart)
    if(!cart ){
       
        cartContainer.innerHTML='';
        cartContainer.innerHTML=`<p class="emptyBasket" >There is no products in cart at the moment</p>`;
return;
    }else{
        
        cartContainer.innerHTML='';
        showCartProducts(cart.items);

        totalAmount.textContent=`${cart.totalPrice.toFixed(2)}€`;
if(cart.items.length>0){
    basket.classList.add('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
    basket.style.backgroundColor='red';
}else{
    basket.classList.remove('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
            basket.style.backgroundColor='transparent';
}



    }
    }
}catch(err){
    alert(err)
}

}



const showCartProducts=(items)=>{
    items.forEach(item=>{
        const html=`
        <div class='product-card' data-productId='${item.productId}' data-size='${item.size}' >

        <h2>${item.name}</h2>
        <p>Size:${item.size}</p>
        <p class='quantity' >Quantity:${item.quantity}</p>
        <p>Price:${item.price}</p>
<button type='button' class='addBtn'  >Add</button>
<button type='button' class='decreaseBtn' >Decrease</button>
<button type='button' class='removeBtn' >Remove</button>
        </div>


        `
        cartContainer.insertAdjacentHTML('beforeend',html);

    })

}

fetchAndDisplayCart();


/////////////////////////////////////////////////////////////////
//for addBtn

cartContainer.addEventListener('click',async (e)=>{

    try{

    if(e.target.classList.contains('addBtn')){
    const productCard=e.target.closest('.product-card');
    const quantity=productCard.querySelector('.quantity');
    const productId=productCard.dataset.productid;
    const size=productCard.dataset.size;

    
    const response=await fetch('/user/order',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({productId,size})
    })
    
    const result=await response.json();
    if(!response.ok){
       alert(`Something went wrong because ${result.message}`);
       console.log('ERROR:',result);
    }else{
        const items=result.data.items;

        const index=items.findIndex(item=>item.productId===productId && item.size===size);

        quantity.textContent=` Quantity ${items[index].quantity}`;
        totalAmount.textContent=result.data.totalPrice.toFixed(2)+"€";

    }
    }else if(e.target.classList.contains('decreaseBtn')){
        const productCard=e.target.closest('.product-card');
        const quantity=productCard.querySelector('.quantity');
        const productId=productCard.dataset.productid;
        const size=productCard.dataset.size;
    


        const response=await fetch('/user/order',{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({productId,size})
        })

        const result=await response.json();
    if(!response.ok){
       alert(`Something went wrong because ${result.message}`);
       console.log('ERROR:',result);
    }else{
        const items=result.data.items;
        const index=items.findIndex(item=>item.productId.toString()===productId && item.size===size);
//index will be -1 if product not found
        if(index>-1){

    if(items[index].quantity>=1){
        quantity.textContent=` Quantity ${items[index].quantity}`;
}


}else {
    console.log('quantity is reached zero')
    productCard.remove();
}

totalAmount.textContent=result.data.totalPrice.toFixed(2) + "€";
        }
    }else if(e.target.classList.contains('removeBtn')){
        const productCard=e.target.closest('.product-card');
        const productId=productCard.dataset.productid;
    


        const response=await fetch('/user/order',{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({productId})
        })

const result= await response.json();
if(!response.ok){
    alert(`ERROR:${result.message}`)
}else{
    basket.classList.remove('animate__animated', 'animate__bounce', 'animate__infinite','animate__slower');
    basket.style.backgroundColor='transparent';
    console.log(result);
    totalAmount.textContent=result.data.totalPrice.toFixed(2) + "€";
    productCard.remove();
}




    }

    


    }catch(err){
        alert(err.message)
        }
    })


    checkoutBtn.addEventListener('click',async()=>{
        try{
checkoutBtn.textContent='Processing...';
checkoutBtn.style.backgroundColor='aqua';

const response=await fetch('/booking/checkout-session',{
    method:'GET',
    headers:{'Content-Type':'application/json'},
    credentials:'include'
})

const result=await response.json();
if(!response.ok){
    checkoutBtn.textContent='Checkout';
    checkoutBtn.style.backgroundColor='rgb(95, 158, 160)';

    alert(`ERROR:${result.message}`)
}else if(result.status==='success'){


    window.location.replace(result.session.url);
}

        }
        catch(err){ 
            alert(`ERROR:${err.message}`)
        }
    })