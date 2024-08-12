import React from 'react';

const Tooth = ({ id, src, alt, onClick }) => {
  return (
    <img
      src={src}
      alt={alt}
      onClick={() => onClick(id)}
      style={{
        width: '40px',
        height: 'auto',
        cursor: 'pointer',
        margin: '5px',
      }}
    />
  );
};

export default Tooth;