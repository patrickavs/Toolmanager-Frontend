import Material from './Material.ts';

class Tool {
  id: string;
  name: string;
  materials: [Material];
  description: string;
  constructor(
    id: string,
    name: string,
    materials: [Material] = [],
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.materials = materials;
    this.description = description;
  }
}

export default Tool;
