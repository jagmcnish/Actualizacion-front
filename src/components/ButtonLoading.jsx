import React from 'react';
import ReactLoading from 'react-loading';
import LoadingSpin from "react-loading-spin";
//  <ReactLoading type='spin' height={30} width={30}

const ButtonLoading = ({ disabled, loading, text, onClick = () => {} }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type='submit'
      className='bg-green-700 text-white font-bold text-lg py-3 px-6  rounded-xl hover:bg-green-500 shadow-md my-2 disabled:opacity-50 disabled:bg-gray-700'
    >
      {loading ?  <LoadingSpin size="40px"
            primaryColor="blue"/> : text}
    </button>
  );
};

export default ButtonLoading;
