import {useEffect} from 'react';
import {useUserContext} from '../../context/UserContext.tsx';
import {useItemsContext} from '../../context/ItemsContext.tsx';

const useMaterials = () => {
  const {materials, fetchMaterialsFromUser} = useUserContext();
  const {fetchMaterials} = useItemsContext();

  useEffect(() => {
    fetchMaterialsFromUser();
    fetchMaterials();
  }, []);

  return materials;
};

export default useMaterials;
