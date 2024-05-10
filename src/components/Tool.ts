import Material from './Material.ts';

interface Tool {
  _id: string;
  name: string;
  materials: Material[];
  description: string;
}

export default Tool;
