import {useEffect} from 'react';
import {useItemsContext} from '../../context/ItemsContext.tsx';

const useTools = () => {
  const {tools, fetchTools} = useItemsContext();

  useEffect(() => {
    fetchTools();
  }, []);

  return tools;
};

export default useTools;
