import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate the total amount for all items in the cart
  const getTotalCartAmount = () => {
    let total = 0;
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        total += item.price * cartItems[item._id];
      }
    });
    return total;
  };

  // Calculate the delivery fee (if the cart has items)
  const getDeliveryFee = () => {
    return getTotalCartAmount() === 0 ? 0 : 2; // Delivery fee is $2 if cart is not empty
  };

  // Calculate the final total (subtotal + delivery fee)
  const getFinalTotal = () => {
    return getTotalCartAmount() + getDeliveryFee();
  };

  return (
    <>
      <div className='cart'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id || index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + '/images/' + item.image} alt='' />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>${getDeliveryFee()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${getFinalTotal()}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order', { replace: true })}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className='cart-promocode'>
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;