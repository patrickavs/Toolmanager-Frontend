import React, {useState, useEffect} from 'react';
import {FlatList, TextInput, View, StyleSheet} from 'react-native';

import {
  getMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
} from '../../service/api.ts';
import ListItem from '../ListItemView.tsx';
import Material from '../Material.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';
import {CustomModal} from '../CustomModal.tsx';

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
      setMaterials(materials.filter(material => material._id !== id));
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
    if (name === 'tools') {
      const toolsArray = value.split(',').map(tool => tool.trim());
      setNewMaterial({...newMaterial, [name]: toolsArray});
    } else {
      setNewMaterial({...newMaterial, [name]: value});
    }
  };

  const renderInputFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={styles.textInput}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newMaterial.name || ''}
        />
        <TextInput
          key="description"
          style={styles.textInput}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newMaterial.description || ''}
        />
        <TextInput
          key="tools"
          style={styles.textInput}
          placeholder="Tools"
          onChangeText={text => handleInputChange('tools', text)}
          value={newMaterial.tools.join(', ') || [].toString()}
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
        keyExtractor={item => item._id}
        style={{paddingTop: 20}}
        ListFooterComponent={<View style={{height: 100}} />}
      />
      <CustomFAB action={() => setIsAddItemModalVisible(true)} />
      <CustomModal
        fields={renderInputFields()}
        action={() => setIsAddItemModalVisible(false)}
        modalVisible={isAddItemModalVisible}
        buttonPressAction={handleAddMaterial}
        deleteAction={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default MaterialList;
