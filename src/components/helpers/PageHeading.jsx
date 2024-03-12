import React from 'react';

const PageHeading = ({ heading }) => {
  return (
    <div
      className="text-center mb-4"
      style={{ padding: '1rem 0', backgroundColor: 'rgba( 0,0,0,0.05)' }}
    >
      <p className='m-0' style={{fontSize:"1.5rem"}}>{heading}</p>
    </div>
  );
};

export default PageHeading;
