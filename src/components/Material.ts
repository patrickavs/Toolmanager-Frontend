import Tool from './Tool.ts';

class Material {
  id: string;
  name: string;
  tools: [Tool];
  description: string;
  constructor(
    id: string = '',
    name: string = 'defaultMaterial',
    tools: [Tool] = [],
    description: string = '',
  ) {
    this.id = id;
    this.name = name;
    this.tools = tools;
    this.description = description;
  }
}

export default Material;
