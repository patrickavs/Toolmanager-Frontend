import Tool from './Tool.ts';
import Material from './Material.ts';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  aboutMe: string;
  bio: string;
  tools: Tool[];
  materials: Material[];
}

export default User;
