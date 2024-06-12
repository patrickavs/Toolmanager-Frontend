import React, {useCallback, useMemo, useState} from 'react';
import {
  Button,
  FlatList,
  Pressable,
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
import {listStyles} from '../../styles/listStyle.ts';

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
      if (tools.length > 0) {
        if (tools.some(t => t.name === newTool.name)) {
          showDuplicateToolToast();
          return;
        }
      }
      const materialIds: string[] = [];
      for (const material of materialInputs) {
        if (materials.length > 0) {
          const existingMaterial = materials.find(
            m => m.name === material.name,
          );
          if (existingMaterial) {
            if (existingMaterial.tools.length === 4) {
              ToastAndroid.show(
                `${existingMaterial.name} has already reached the limit of tools`,
                ToastAndroid.SHORT,
              );
              continue;
            }
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

      await addToolToUser(newToolWithIds);
      setNewTool(getInitialState());
      setIsAddItemModalVisible(false);
      setMaterialInputs([]);
      ToastAndroid.show('Successfully added Tool', ToastAndroid.SHORT);
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
      ToastAndroid.show(
        `Successfully deleted ${tool.name}`,
        ToastAndroid.SHORT,
      );
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
          style={listStyles.textInput}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newTool.name || ''}
        />
        <TextInput
          key="description"
          style={listStyles.textInput}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newTool.description || ''}
        />
        <Text style={listStyles.materialTitle}>Materials</Text>
        {materialInputs.map((material: Material, index: number) => (
          <View
            key={`${material._id}`}
            style={listStyles.materialInputContainer}>
            <TextInput
              style={listStyles.textInput}
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
        <View style={listStyles.addMaterialButtonContainer}>
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
      key={item._id}
      onPress={() =>
        //@ts-ignore
        navigation.navigate('DetailView', {item: item, type: 'Tool'})
      }>
      <ListItem key={item._id} item={item} onDeleteItem={handleDeleteTool} />
    </Pressable>
  );

  return (
    <>
      <View style={listStyles.filterContainer}>
        <TextInput
          style={listStyles.filterInput}
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

export default ToolList;
