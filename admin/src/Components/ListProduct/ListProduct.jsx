import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

 
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/getallproducts');
      const data = await response.json();
      
    
      if (data.success) {
        setAllProducts(data.products); 
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

 
  useEffect(() => {
    fetchInfo();
  }, []);

  
  const remove_product = async (id) => {
    try {
        console.log(`Sending DELETE request for product with ID: ${id}`); 

        // Send the correct _id to the backend
        const response = await fetch(`http://localhost:4000/deleteproduct/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        
        console.log(data); 

        if (data.success) {
            alert('Product removed successfully');
            await fetchInfo(); // Refresh the product list
        } else {
            alert(`Failed to remove product: ${data.message}`);
        }
    } catch (error) {
        console.error('Error removing product:', error);
        alert('An error occurred while removing the product.');
    }
};




  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.length > 0 ? (
    allproducts.map((product, index) => {
        return (
            <div key={product._id} className='listproduct-format-main listproduct-format'>
                <img src={product.image} alt={product.name} className="listproduct-produc-icon" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={() => {remove_product(product._id)}} className='listproduct-remove-icon' src={cross_icon} alt="remove" />
            </div>
        );
    })
) : (
    <p>No products found</p>
)}

      </div>
    </div>
  );
}

export default ListProduct;
