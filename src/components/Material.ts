import Tool from './Tool.ts';

interface Material {
  _id: string;
  name: string;
  tools: Tool[];
  description: string;
}

export default Material;
