import {useEffect} from 'react';
import {useUserContext} from '../../context/UserContext.tsx';

const useMaterials = () => {
  const {materials, fetchMaterials} = useUserContext();

  useEffect(() => {
    fetchMaterials();
  }, []);

  return materials;
};

export default useMaterials;
