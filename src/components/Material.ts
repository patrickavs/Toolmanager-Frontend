import Tool from './Tool.ts';

interface Material {
  id: string;
  name: string;
  tools: Tool[];
  description: string;
}

export default Material;
