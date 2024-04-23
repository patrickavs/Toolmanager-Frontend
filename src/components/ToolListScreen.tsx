import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import {
  getTools,
  addTool,
  updateTool,
  removeTool,
  getMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
} from '../service/api.ts';
import ListItem from './ListItemView.tsx';
import Item from './Item.ts';

interface ListProps<T extends Item> {
  title: string;
}

function CustomList<T extends Item>({title}: ListProps<T>) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const toolsData = await getTools();
      const materialsData = await getMaterials();
      setItems([...toolsData, ...materialsData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const newItem = await addTool('New Tool');
      setItems([...items, newItem]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTool(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = async (id: string, updatedItem: Partial<T>) => {
    try {
      const updatedTool = await updateTool(id, updatedItem);
      setItems(items.map(item => (item.id === id ? updatedTool : item)));
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
    <View>
      <Text style={{fontSize: 20, marginBottom: 10}}>{title}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
}

export default CustomList;
