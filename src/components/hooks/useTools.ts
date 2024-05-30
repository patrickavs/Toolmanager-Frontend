import {useEffect} from 'react';
import {useUserContext} from '../../context/UserContext.tsx';

const useTools = () => {
  const {tools, fetchTools} = useUserContext();

  useEffect(() => {
    fetchTools();
  }, []);

  return tools;
};

export default useTools;
