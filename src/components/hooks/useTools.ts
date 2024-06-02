import {useEffect} from 'react';
import {useUserContext} from '../../context/UserContext.tsx';
import {useItemsContext} from '../../context/ItemsContext.tsx';

const useTools = () => {
  const {tools, fetchToolsFromUser} = useUserContext();
  const {fetchTools} = useItemsContext();

  useEffect(() => {
    fetchToolsFromUser();
    fetchTools();
  }, []);

  return tools;
};

export default useTools;
