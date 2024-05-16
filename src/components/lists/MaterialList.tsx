import React, {useState, useEffect} from 'react';
import {
  FlatList,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';

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
import Ionicon from 'react-native-vector-icons/Ionicons';
import Tool from '../Tool.ts';
import {useNavigation} from '@react-navigation/native';

const initialState: Material = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  tools: [],
};

const MaterialList = () => {
  const navigation = useNavigation();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>(initialState);
  const [toolInputs, setToolInputs] = useState<Tool[]>([]);

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
      setToolInputs([]);
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

  const handleInputChange = (
    name: string,
    value: string,
    index: number | null = null,
  ) => {
    if (name === 'tools' && index !== null) {
      const updatedTools: Tool[] = [...toolInputs];
      updatedTools[index].name = value;
      setToolInputs(updatedTools);
      setNewMaterial({
        ...newMaterial,
        tools: updatedTools,
      });
    } else {
      setNewMaterial({...newMaterial, [name]: value});
    }
  };

  const addToolInput = () => {
    const newTool: Tool = {
      _id: ObjectID().toHexString(),
      name: '',
      materials: [],
      description: '',
    };
    setToolInputs([...toolInputs, newTool]);
  };

  const removeToolInput = (index: number) => {
    const updatedTools = toolInputs.filter((_: Tool, i: number) => i !== index);
    setToolInputs(updatedTools);
    setNewMaterial({...newMaterial, tools: updatedTools});
  };

  const renderModalFields = () => {
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
        <Text style={styles.toolTitle}>Tools</Text>
        {toolInputs.map((tool: Tool, index: number) => (
          <View key={`${tool._id}`} style={styles.toolInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Tool Name"
              onChangeText={text => handleInputChange('tools', text, index)}
              value={tool.name || ''}
            />
            <TouchableOpacity
              style={{paddingLeft: 7}}
              onPress={() => removeToolInput(index)}>
              <Ionicon name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addToolButtonContainer}>
          <Button title={'Add Tool'} onPress={addToolInput} color={'green'} />
        </View>
      </>
    );
  };

  const renderMaterial = ({item}: {item: Material}) => (
    <ListItem
      item={item}
      onDeleteItem={handleDeleteMaterial}
      onUpdateItem={handleUpdateMaterial}
      onClick={() =>
        navigation.navigate('DetailView', {item: item, itemType: 'Material'})
      }
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
        title="Add New Material"
        fields={renderModalFields()}
        action={() => {
          setIsAddItemModalVisible(false);
          setToolInputs([]);
        }}
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
    flexGrow: 1,
  },
  toolTitle: {
    fontSize: 17,
    paddingVertical: 10,
  },
  addToolButtonContainer: {
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  toolInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default MaterialList;
