import React, { useState, useEffect } from 'react';
import './NewCollection.css';
import Item from '../Item/Item';

const NewCollection = () => {
  const [new_collection, setNew_Collection] = useState([]);
  
  useEffect(() => {
    // Fix the URL (remove space)
    fetch('http://localhost:4000/newcollections')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setNew_Collection(data);
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error);
      });
  }, []);
  
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTION</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return (
            <Item
              key={i}
              id={item._id}  // Use '_id' if it's the MongoDB field, not 'id'
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollection;
