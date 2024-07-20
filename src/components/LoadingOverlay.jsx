import React from 'react'
import { ClipLoader } from 'react-spinners'

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-30 z-50">
      <ClipLoader color="#3498db" loading={isLoading} size={50} />
    </div>
  );
};

export default LoadingOverlay;
