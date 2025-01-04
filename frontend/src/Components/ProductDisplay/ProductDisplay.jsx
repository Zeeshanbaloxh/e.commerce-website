import React, { useContext } from 'react'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import './ProductDisplay.css'
import { ShopContext } from '../../context/ShopContext'

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
  return (
    <div className='product-display'>
      <div className='prduct-display-left'>
       <div className="productdisplay-img-list">
        
       </div>
       <div className="productdisplay-img">
        <img className='productdisplay-main-img' src={product.image} alt="" />
       </div>
      </div>
      <div className='product-dislay-right'>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon}  alt="" />
            <img src={star_icon}  alt="" />
            <img src={star_icon}  alt="" />
            <img src={star_dull_icon}  alt="" />
            <p>{122}</p>
        </div>
        <div className="productdisplay-right-prices">
            <div className='productdisplay-right-price-old'>${product.old_price}</div>
            <div className='productdisplay-right-price-new'>${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
            Alightweight, usually knitted, pulover shirt,close-fitting and a round neckline and short sleeves,worm as an undershirt or outer garment. 
        </div>
        <div className='productdisplay-right-size'>
            
        </div>
        <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
        <p className='productdisplay-right-category'><span>Category :</span>Women, T-Shirt, Crop Top</p>
        <p className='productdisplay-right-category'><span>Tags :</span>Modern, Latest</p>
      </div>
    </div>
  )
}

export default ProductDisplay