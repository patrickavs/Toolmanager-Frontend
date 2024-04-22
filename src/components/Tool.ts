class Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  constructor(id: number, name: string, category: string, description: string) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
  }
}

export default Tool;
