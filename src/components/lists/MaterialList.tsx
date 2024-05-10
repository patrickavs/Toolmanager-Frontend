import React, {useState, useEffect} from 'react';
import {Button, FlatList, Text, TextInput, View, Modal} from 'react-native';

import {
  getMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
} from '../../service/api.ts';
import ListItem from '../ListItemView.tsx';
import Material from '../Material.ts';
import ObjectID from 'bson-objectid';

const initialState: Material = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  tools: [],
};

const MaterialList = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>(initialState);

  useEffect(() => {
    fetchMaterials().then(r => console.log(r));
  }, []);

  const fetchMaterials = async () => {
    try {
      const fetchedMaterials = await getMaterials();
      setMaterials(fetchedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleAddMaterial = async () => {
    try {
      await addMaterial(newMaterial);
      setIsAddItemModalVisible(false);
      setNewMaterial(initialState);
      await fetchMaterials();
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await removeMaterial(id);
      setMaterials(materials.filter(material => material.id !== id));
      await fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleUpdateMaterial = async (id: string, data: Partial<Material>) => {
    try {
      await updateMaterial(id, data);
      await fetchMaterials();
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setNewMaterial({...newMaterial, [name]: value});
  };

  const renderInputFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newMaterial.name || ''}
        />
        <TextInput
          key="description"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newMaterial.description || ''}
        />
        <TextInput
          key="tools"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Tools"
          onChangeText={text => handleInputChange('tools', text)}
          value={newMaterial.tools.toString() || [].toString()}
        />
      </>
    );
  };

  const renderMaterial = ({item}: {item: Material}) => (
    <ListItem
      item={item}
      onDeleteItem={handleDeleteMaterial}
      onUpdateItem={handleUpdateMaterial}
    />
  );

  return (
    <>
      <FlatList
        data={materials}
        renderItem={renderMaterial}
        keyExtractor={item => item.id}
        style={{marginTop: 20}}
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
            <Text>Add New Material</Text>
            {renderInputFields()}
            <Button title="Save" onPress={handleAddMaterial} />
            <Button
              title="Cancel"
              onPress={() => setIsAddItemModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MaterialList;
