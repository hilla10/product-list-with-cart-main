let cartQuantity = 0; // Keep track of total cart quantity
const price = document.querySelector('.price'),
  title = document.querySelector('.title'),
  addToCarts = document.querySelectorAll('.add-cart-btn');
(card = document.querySelectorAll('.card')),
  (cardImgs = document.querySelectorAll('.card-img')),
  (cart = document.querySelector('.cart'));
(modal = document.querySelector('.modal')),
  (cartTitle = document.querySelector('.cart-title')),
  (orderedItem = document.querySelector('#ordered-item')),
  (orderPrice = document.querySelector('#order-price')),
  (orderQuantity = document.querySelector('#order-quantity')),
  (quantityPrice = document.querySelector('#quantity-price'));
const message = document.querySelector('.message');
const total = document.querySelector('#total');
const emptyCart = document.querySelector('.empty-cart');
const totalOrderedPriceElm = document.querySelector('#total-ordered-price');
const totalPriceElm = document.querySelector('#total-price');

let itemCount = 0;

let cardImg;

const addToCart = (e) => {
  // let parent;
  let parent = e.target.closest('.card');
  itemCount = 1;
  const itemName = parent.querySelector('.title').textContent;
  const itemPrice = parent.querySelector('#price').textContent;
  const quantityControls = parent.querySelectorAll('.quantity-controls');
  const itemQuantity = parent.querySelector('.item-quantity');
  cardImg = parent.querySelector('.card-img');

  cardImg.classList.add('active');
  itemQuantity.textContent = itemCount;
  cartQuantity += 1;
  generateHtml(cartQuantity, itemName, itemPrice, itemCount, parent);
  quantityControl(
    quantityControls,
    itemCount,
    parent,
    cartQuantity,
    itemName,
    itemPrice,
    itemCount
  );
};

addToCarts.forEach((getItem) => {
  getItem.addEventListener('click', addToCart);
});

function quantityControl(
  quantityControls,
  itemCount,
  parent,
  cartQuantity,
  itemName,
  itemPrice,
  itemCount
) {
  quantityControls.forEach((quantityControl) => {
    quantityControl.style.display = 'flex';

    quantityControl.addEventListener('click', (e) => {
      if (e.target.classList.contains('increment')) {
        itemCount++;
        cartQuantity++;
      } else if (e.target.classList.contains('decrement')) {
        if (itemCount <= 1) {
          quantityControl.style.display = 'none';
          itemCount = 0;

          if (cartQuantity <= 1) {
            cartQuantity = 0;
          }
        } else {
          itemCount--;
          if (cartQuantity <= 0) {
            cartQuantity = 0;
          }
          cartQuantity--;
        }
      }
      const itemQuantities = parent.querySelectorAll('.item-quantity');

      itemQuantities.forEach((itemQuantity) => {
        itemQuantity.innerHTML = itemCount;
      });
      generateHtml(cartQuantity, itemName, itemPrice, itemCount, parent);
    });
  });
}

function calculateTotalOrderedPrice() {
  const quantityPrices = document.querySelectorAll('.quantity-price');
  let totalOrderedPrice = 0;

  quantityPrices.forEach((quantityPrice) => {
    totalOrderedPrice += parseFloat(quantityPrice.textContent.replace('$', ''));
  });

  totalOrderedPriceElm.textContent = `$${totalOrderedPrice.toFixed(2)}`;
}

function updateTotalPriceDisplay() {
  totalPriceElm.innerHTML = totalOrderedPriceElm.textContent;
}

function generateHtml(cartQuantity, itemName, itemPrice, itemCount, parent) {
  cartTitle.innerHTML = `Your Cart(${cartQuantity})`;
  const totalPrice = (Number(itemPrice) * itemCount).toFixed(2);
  const cartNames = document.querySelectorAll('.cart-name');
  let itemExists = false;

  // Loop through existing cart items to update quantities and prices
  cartNames.forEach((cartName) => {
    if (cartName.textContent === itemName) {
      itemExists = true;
      const quantityElm =
        cartName.parentElement.querySelector('#order-quantity');
      const priceElm = cartName.parentElement.querySelector('.quantity-price');

      if (itemCount <= 0) {
        cartName.closest('.flex.border').remove();
      } else {
        quantityElm.textContent = `${itemCount}x`;
        priceElm.textContent = `$${totalPrice}`;
      }
    }
  });

  // If the item does not exist in the cart, add it
  if (!itemExists && itemCount > 0) {
    orderedItem.innerHTML += `
      <div class="flex border">
        <div>
          <p class="cart-name">${itemName}</p>
          <div class="price__container">
            <span class="quantity text-red" id="order-quantity">${itemCount}x</span>
            <p class="price" id="order-price">@ $${itemPrice}</p>
            <p class="quantity-price">$${totalPrice}</p>
          </div>
        </div>
        <div class="remove-item">
          <img src="assets/images/icon-remove-item.svg" alt="remove Item">
        </div>
      </div>
    `;
  }

  // Calculate the total ordered price and update the totalPriceElm
  calculateTotalOrderedPrice();

  total.style.display = 'block';
  emptyCart.style.display = 'none';

  // Get the correct image for the item
  const imgClass = parent.querySelector('.card-img');
  const imgSrc = imgCheck(imgClass);

  // Confirm the order with the correct image and details
  confirmOrder(itemName, itemCount, itemPrice, imgSrc);

  // Update the total price display after the order is confirmed
  updateTotalPriceDisplay();
}

const order = document.querySelector('.order-item');
function confirmOrder(name, quantity, price, imgSrc) {
  const itemNames = document.querySelectorAll('.item-name');

  const totalPrice = (Number(quantity) * price).toFixed(2);

  let itemExists = false;

  itemNames.forEach((itemName) => {
    if (itemName.textContent === name) {
      itemExists = true;

      const quantityElm =
        itemName.parentElement.parentElement.querySelector('.quantity');
      const priceElm =
        itemName.parentElement.parentElement.querySelector('.price');
      const totalPriceElement =
        itemName.parentElement.parentElement.parentElement.querySelector(
          '.price-value'
        );

      quantityElm.textContent = `${quantity}x`;
      priceElm.textContent = `@ $${price}`;
      totalPriceElement.textContent = `$${totalPrice}`;
    }
  });

  if (!itemExists) {
    order.innerHTML += `
      <div class="border flex">
        <div class="item">
          <img src="${imgSrc}" alt="" id="img">
          <div class="item-content">
            <p class="item-name">${name}</p>
            <div class="price-content">
              <span class="quantity text-red">${quantity}x</span>
              <p class="price">@ $${price} </p>
            </div>
          </div>
        </div>
        <div class="price-value">$${totalPrice}</div>
      </div>
    `;
  }

  // Update the total price after adding the new item
  calculateTotalOrderedPrice();
  updateTotalPriceDisplay();
}

function imgCheck(imgClass) {
  if (!imgClass) return '../assets/images/image-default.jpg'; // Default image if imgClass is not found

  let imgSrc = '../assets/images/image-default.jpg'; // Default image

  if (imgClass.classList.contains('waffle-img')) {
    imgSrc = '../assets/images/image-waffle-desktop.jpg';
  } else if (imgClass.classList.contains('creme-img')) {
    imgSrc = '../assets/images/image-creme-brulee-desktop.jpg';
  } else if (imgClass.classList.contains('macaron-img')) {
    imgSrc = '../assets/images/image-macaron-desktop.jpg';
  } else if (imgClass.classList.contains('tiramisu-img')) {
    imgSrc = '../assets/images/image-tiramisu-desktop.jpg';
  } else if (imgClass.classList.contains('baklava-img')) {
    imgSrc = '../assets/images/image-baklava-desktop.jpg';
  } else if (imgClass.classList.contains('pie-img')) {
    imgSrc = '../assets/images/image-meringue-desktop.jpg';
  } else if (imgClass.classList.contains('cake-img')) {
    imgSrc = '../assets/images/image-cake-desktop.jpg';
  } else if (imgClass.classList.contains('brownie-img')) {
    imgSrc = '../assets/images/image-brownie-desktop.jpg';
  }

  return imgSrc;
}

const confirm = document.querySelector('#confirm');

confirm.addEventListener('click', () => {
  modal.classList.add('active');
});

const startNew = document.querySelector('#start-new');
startNew.addEventListener('click', () => {
  const quantityControls = document.querySelectorAll('.quantity-controls');
  modal.classList.remove('active');
  total.style.display = 'none';
  order.innerHTML = '';
  orderedItem.innerHTML = '';
  emptyCart.style.display = 'block';
  cartTitle.innerHTML = 'Your Cart(0)';

  cardImgs.forEach((cardImg) => {
    cardImg.classList.remove('active');
  });

  quantityControls.forEach((quantityControl) => {
    quantityControl.style.display = 'none';
  });
});
