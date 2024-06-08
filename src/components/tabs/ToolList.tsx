import React, {useCallback, useMemo, useState} from 'react';
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ListItem from '../ListItemView.tsx';
import Tool from '../Tool.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';
import {CustomModal} from '../CustomModal.tsx';
import Material from '../Material.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useUserContext} from '../../context/UserContext.tsx';
import useTools from '../hooks/useTools.ts';
import {get_Tool} from '../../service/api.ts';

const getInitialState = () => ({
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  materials: [],
});

const ToolList = () => {
  const navigation = useNavigation();
  const tools = useTools();
  const {
    fetchToolsFromUser,
    addToolToUser,
    updateMaterialFromUser,
    deleteToolFromUser,
    addMaterialToUser,
    materials,
  } = useUserContext();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newTool, setNewTool] = useState<Tool>(getInitialState());
  const [materialInputs, setMaterialInputs] = useState<Material[]>([]);
  const [filterValue, setFilterValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchToolsFromUser();
      };
      fetchData().then(() => console.log('successfully fetched tools'));
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchToolsFromUser();
    setRefreshing(false);
  };

  const showDuplicateToolToast = () => {
    ToastAndroid.showWithGravity(
      'A tool with the same name already exists.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const addNewMaterialToUser = async (
    material: Material,
    materialIds: string[],
  ) => {
    const newMaterial = {
      ...material,
      tools: [newTool._id],
    };
    await addMaterialToUser(newMaterial);
    materialIds.push(newMaterial._id);
  };

  const handleAddTool = async () => {
    try {
      const materialIds: string[] = [];
      for (const material of materialInputs) {
        if (materials.length > 0) {
          const existingMaterial = materials.find(
            m => m.name === material.name,
          );
          if (existingMaterial) {
            // Update the existing material with the new tool ID
            await updateMaterialFromUser(existingMaterial._id, {
              ...existingMaterial,
              tools: [...existingMaterial.tools, newTool._id],
            });
            materialIds.push(existingMaterial._id);
          } else {
            // Add the new material to the user
            await addNewMaterialToUser(material, materialIds);
          }
        } else {
          // Add the new material to the user
          await addNewMaterialToUser(material, materialIds);
        }
      }

      const newToolWithIds = {
        ...newTool,
        materials: materialIds,
      };

      if (tools.length > 0) {
        if (tools.some(t => t.name === newTool.name)) {
          showDuplicateToolToast();
          return;
        }
      }

      await addToolToUser(newToolWithIds);
      setNewTool(getInitialState());
      setIsAddItemModalVisible(false);
      setMaterialInputs([]);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      const tool: Tool = await get_Tool(id);
      if (materials.length > 0) {
        for (const material of materials) {
          const newToolsForMaterial = material.tools.filter(
            toolId => tool._id !== toolId,
          );
          await updateMaterialFromUser(material._id, {
            ...material,
            tools: newToolsForMaterial,
          });
        }
      }
      await deleteToolFromUser(id);
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
        materials: updatedMaterials.map(material => material._id),
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
    const updatedMaterials = materialInputs.filter((_, i) => i !== index);
    setMaterialInputs(updatedMaterials);
    setNewTool({
      ...newTool,
      materials: updatedMaterials.map(material => material._id),
    });
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
          {materialInputs.length < 4 ? (
            <Button
              title={'Add Material'}
              onPress={addMaterialInput}
              color={'green'}
            />
          ) : null}
        </View>
      </>
    );
  };

  const filterTools = useCallback(
    (toolsForFilter: any[], filteredValue: string) => {
      if (toolsForFilter.length > 0) {
        return toolsForFilter.filter(tool =>
          tool.name.toLowerCase().includes(filteredValue.toLowerCase()),
        );
      }
      return [];
    },
    [],
  );

  // probably adding sorting

  const filteredTools = useMemo(() => {
    return filterTools(tools, filterValue) || [];
  }, [tools, filterValue, filterTools]);

  const renderTool = ({item}: {item: Tool}) => (
    <Pressable
      onPress={() =>
        //@ts-ignore
        navigation.navigate('DetailView', {item: item, type: 'Tool'})
      }>
      <ListItem key={item._id} item={item} onDeleteItem={handleDeleteTool} />
    </Pressable>
  );

  return (
    <>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter tools..."
          onChangeText={text => setFilterValue(text)}
          value={filterValue}
        />
      </View>
      <FlatList
        data={filteredTools}
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
        buttonDisabled={newTool.name === ''}
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
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    flexGrow: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    paddingTop: 20,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
});

export default ToolList;
