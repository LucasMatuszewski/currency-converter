import React from 'react';

const Loader = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        className="loader"
        data-testid="loader-element"
        style={{ height: '60px', width: '60px', margin: '50px auto' }}
      />
    </div>
  );
};

export default Loader;
