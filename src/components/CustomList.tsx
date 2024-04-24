import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text} from 'react-native';

import {
  getTools,
  addTool,
  updateTool,
  removeTool,
  getMaterials,
  updateMaterial,
  removeMaterial,
  addMaterial,
} from '../service/api.ts';

import ListItem from './ListItemView.tsx';

import Tool from './Tool.ts';
import Material from './Material.ts';

type ItemType = Tool | Material;

function CustomListView<T extends ItemType>({
  title,
  type,
}: {
  title: string;
  type: T;
}) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data: T[];
        if (type === Tool) {
          data = await getTools();
        } else {
          data = await getMaterials();
        }
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().then(r => console.log(r));
  }, [type]);

  const handleAddItem = async () => {
    try {
      const newItemName = 'New ' + (type === Tool ? 'Tool' : 'Material');
      let newItem: T;
      if (type === Tool) {
        newItem = await addTool(newItemName);
      } else {
        newItem = await addMaterial(newItemName);
      }
      setItems([...items, newItem]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (type === Tool) {
        await removeTool(id);
      } else {
        await removeMaterial(id);
      }
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = async (id: string, updatedItem: Partial<T>) => {
    try {
      let updatedData: any;
      if (type === Tool) {
        updatedData = await updateTool(id, updatedItem);
      } else {
        updatedData = await updateMaterial(id, updatedItem);
      }
      setItems(items.map(item => (item.id === id ? updatedData : item)));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const renderItem = ({item}: {item: T}) => (
    <ListItem
      item={item}
      onDeleteItem={handleDelete}
      onUpdateItem={handleUpdate}
    />
  );

  return (
    <>
      <Text style={{fontSize: 20, marginBottom: 10}}>{title}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </>
  );
}

export default CustomListView;
