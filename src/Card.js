import React, { useState } from 'react';

//create card object using props. 

function Card({name, image}) {
  return <img className="Card"
            alt={name}
            src={image} />;
}

export default Card;