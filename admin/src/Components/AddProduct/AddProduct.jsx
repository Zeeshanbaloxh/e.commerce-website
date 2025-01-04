import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: '',
  });

  // Handle image selection
  const imageHandler = (e) => {
    setProductDetails({ ...productDetails, image: e.target.files[0] });
  };

  // Handle form input changes
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Validate and submit the product
  const Add_Product = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (
      !productDetails.name ||
      !productDetails.image ||
      !productDetails.new_price ||
      !productDetails.old_price
    ) {
      return alert('All fields are required.');
    }

    // Validate price fields
    if (isNaN(productDetails.new_price) || isNaN(productDetails.old_price)) {
      return alert('Price fields must be valid numbers.');
    }

    // Ensure that prices are positive numbers
    if (parseFloat(productDetails.new_price) <= 0 || parseFloat(productDetails.old_price) <= 0) {
      return alert('Price fields must be positive numbers.');
    }

    const formData = new FormData();
    formData.append('product', productDetails.image);

    try {
      // Upload Image to the server
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.success) {
        // Prepare the updated product details with the image URL
        const updatedProduct = {
          ...productDetails,
          image: responseData.image_url, // Use the returned image URL from the backend
          available: true, // You can modify this based on your logic
        };

        // Add product details to the database
        const productResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        const productData = await productResponse.json();

        if (productData.success) {
          alert('Product Added Successfully');

          // Reset form after successful submission
          setProductDetails({
            name: '',
            image: '',
            category: 'women',
            new_price: '',
            old_price: '',
          });
        } else {
          alert('Failed to add product');
        }
      } else {
        alert('Image upload failed: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error adding product');
    }
  };

  return (
    <div className='add-product'>
      <form onSubmit={Add_Product}>
        <div className='addproduct-itemfield'>
          <p>Product title</p>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type='text'
            name='name'
            placeholder='Type here...'
          />
        </div>

        <div className='addproduct-price'>
          <div className='addproduct-itemfield'>
            <p>Price</p>
            <input
              value={productDetails.old_price}
              onChange={changeHandler}
              type='text'
              name='old_price'
              placeholder='Type here...'
            />
          </div>
          <div className='addproduct-itemfield'>
            <p>Offer Price</p>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type='text'
              name='new_price'
              placeholder='Type here...'
            />
          </div>
        </div>

        <div className='addproduct-itemfield'>
          <p>Product Category</p>
          <select
            value={productDetails.category}
            onChange={changeHandler}
            name='category'
            className='add-product-selector'>
            <option value='women'>Women</option>
            <option value='men'>Men</option>
            <option value='kid'>Kid</option>
          </select>
        </div>

        <div className='addproduct-itemfield'>
          <label htmlFor='file-input'>
            <img
              src={productDetails.image ? URL.createObjectURL(productDetails.image) : upload_area}
              className='addproduct-thumnail-img'
              alt='Product Thumbnail'
            />
          </label>
          <input onChange={imageHandler} type='file' name='image' id='file-input' hidden />
        </div>

        <button type='submit' className='addproduct-btn'>
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
