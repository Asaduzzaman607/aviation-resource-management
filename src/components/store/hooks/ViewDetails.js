import { useState } from 'react';

function useViewDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);

  const handleViewDetails = (data) => {
    setIsModalOpen(true);
    setData(data);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    data,
    handleViewDetails,
  };
}

export default useViewDetails;
