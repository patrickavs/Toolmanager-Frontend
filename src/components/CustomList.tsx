/*import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View, Modal} from 'react-native';

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

function CustomListView<T>({title, type}: {title: string, type: T}) {
  const [items, setItems] = useState<T[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<Partial<T>>({});

  useEffect(() => {
    fetchData()
  });

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
  }

  const handleAddItem = async () => {
    try {
      if (type === Tool) {
        await addTool(newItem as unknown as Tool);
      } else {
        await addMaterial(newItem as unknown as Material);
      }
      setIsAddItemModalVisible(false);
      setNewItem({});
      await fetchData();
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

  const handleUpdate = async (id: string, data: Partial<T>) => {
    try {
      if (type === Tool) {
        await updateTool(id, data);
      } else {
        await updateMaterial(id, data);
      }
      await fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setNewItem({...newItem, [name]: value});
  };

  const renderInputFields = () => {
    const fields = [];

    fields.push(
      <TextInput
        key="name"
        style={{borderWidth: 1, padding: 5, marginVertical: 10}}
        placeholder="Name"
        onChangeText={text => handleInputChange('name', text)}
        value={newItem.name || ''}
      />,
      <TextInput
        key="description"
        style={{borderWidth: 1, padding: 5, marginVertical: 10}}
        placeholder="Description"
        onChangeText={text => handleInputChange('description', text)}
        value={newItem.name || ''} // Typo fixed: value should be newItem.description
      />,
    );

    if (typeof Tool) {
      fields.push(
        <TextInput
          key="materials"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Materials"
          onChangeText={text => handleInputChange('materials', text)}
          value={newItem.name || ''}
        />,
      );
    } else {
      fields.push(
        <TextInput
          key="tools"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Tools"
          onChangeText={text => handleInputChange('tools', text)}
          value={newItem.name || ''}
        />,
      );
    }

    return fields;
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
      <Button
        color={'green'}
        title="+"
        onPress={() => setIsAddItemModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddItemModalVisible}
        onRequestClose={() => setIsAddItemModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: 'white', padding: 20}}>
            <Text>Add New {typeof Tool ? 'Tool' : 'Material'}</Text>
            {renderInputFields()}
            <Button title="Save" onPress={handleAddItem} />
            <Button
              title="Cancel"
              onPress={() => setIsAddItemModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default CustomListView;*/
