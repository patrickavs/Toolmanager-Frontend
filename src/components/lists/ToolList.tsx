import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  TextInput,
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';

import {getTools, addTool, removeTool} from '../../service/api.ts';
import ListItem from '../ListItemView.tsx';
import Tool from '../Tool.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';
import {CustomModal} from '../CustomModal.tsx';
import Material from '../Material.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const initialState: Tool = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  materials: [],
};

const ToolList = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newTool, setNewTool] = useState<Tool>(initialState);
  const [materialInputs, setMaterialInputs] = useState<Material[]>([]);

  useEffect(() => {
    fetchTools();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTools();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTools();
    setRefreshing(false);
  };

  const fetchTools = async () => {
    try {
      const fetchedTools = await getTools();
      setTools(fetchedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleAddTool = async () => {
    try {
      await addTool(newTool);
      setIsAddItemModalVisible(false);
      setNewTool(initialState);
      setMaterialInputs([]);
      await fetchTools();
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      await removeTool(id);
      setTools(tools.filter(tool => tool._id !== id));
      await fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleInputChange = (
    name: string,
    value: string,
    index: number | null = null,
  ) => {
    if (index !== null) {
      const updatedMaterials: Material[] = [...materialInputs];
      updatedMaterials[index].name = value;
      setMaterialInputs(updatedMaterials);
      setNewTool({
        ...newTool,
        materials: updatedMaterials,
      });
    } else {
      setNewTool({...newTool, [name]: value});
    }
  };

  const addMaterialInput = () => {
    const newMaterial: Material = {
      _id: ObjectID().toHexString(),
      name: '',
      tools: [],
      description: '',
    };
    setMaterialInputs([...materialInputs, newMaterial]);
  };

  const removeMaterialInput = (index: number) => {
    const updatedMaterials = materialInputs.filter(
      (_: Material, i: number) => i !== index,
    );
    setMaterialInputs(updatedMaterials);
    setNewTool({...newTool, materials: updatedMaterials});
  };

  const renderModalFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={styles.textInput}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newTool.name || ''}
        />
        <TextInput
          key="description"
          style={styles.textInput}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newTool.description || ''}
        />
        <Text style={styles.materialTitle}>Materials</Text>
        {materialInputs.map((material: Material, index: number) => (
          <View key={`${material._id}`} style={styles.materialInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Material Name"
              onChangeText={text => handleInputChange('materials', text, index)}
              value={material.name || ''}
            />
            <TouchableOpacity
              style={{paddingLeft: 7}}
              onPress={() => removeMaterialInput(index)}>
              <Ionicons name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addMaterialButtonContainer}>
          <Button
            title={'Add Material'}
            onPress={addMaterialInput}
            color={'green'}
          />
        </View>
      </>
    );
  };

  const renderTool = ({item}: {item: Tool}) => (
    <TouchableOpacity
      onPress={() =>
        //@ts-ignore
        navigation.navigate('DetailView', {item: item, type: 'Tool'})
      }>
      <ListItem key={item._id} item={item} onDeleteItem={handleDeleteTool} />
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={tools}
        renderItem={renderTool}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={item => item._id}
        style={{paddingTop: 20}}
        ListFooterComponent={<View style={{height: 100}} />}
      />
      <CustomFAB action={() => setIsAddItemModalVisible(true)} />
      <CustomModal
        title={'Add New Tool'}
        fields={renderModalFields()}
        action={() => {
          setIsAddItemModalVisible(false);
          setMaterialInputs([]);
        }}
        modalVisible={isAddItemModalVisible}
        buttonPressAction={handleAddTool}
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
  materialTitle: {
    fontSize: 17,
    paddingVertical: 10,
  },
  addMaterialButtonContainer: {
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  materialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default ToolList;
