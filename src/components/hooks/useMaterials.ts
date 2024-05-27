import {useEffect} from 'react';
import {useItemsContext} from '../../context/ItemsContext.tsx';

const useMaterials = () => {
  const {materials, fetchMaterials} = useItemsContext();

  useEffect(() => {
    fetchMaterials();
  }, []);

  return materials;
};

export default useMaterials;
