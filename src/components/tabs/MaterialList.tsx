import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Button,
  Pressable,
  ToastAndroid,
} from 'react-native';
import ListItem from '../ListItemView.tsx';
import Material from '../Material.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';
import {CustomModal} from '../CustomModal.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tool from '../Tool.ts';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useUserContext} from '../../context/UserContext.tsx';
import useMaterials from '../hooks/useMaterials.ts';
import {get_Material} from '../../service/api.ts';
import {listStyles} from '../../styles/listStyle.ts';

const getInitialState = () => ({
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  tools: [],
});

const MaterialList = () => {
  const navigation = useNavigation();
  const materials = useMaterials();
  const {fetchMaterialsFromUser} = useUserContext();
  const {
    addMaterialToUser,
    deleteMaterialFromUser,
    addToolToUser,
    tools,
    updateToolFromUser,
  } = useUserContext();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>(getInitialState());
  const [toolInputs, setToolInputs] = useState<Tool[]>([]);
  const [filterValue, setFilterValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchMaterialsFromUser();
      };
      fetchData().then(() => console.log('successfully fetched materials'));
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMaterialsFromUser();
    setRefreshing(false);
  };

  const showDuplicateMaterialToast = () => {
    ToastAndroid.show(
      'Ein Material mit demselben Namen existiert bereits',
      ToastAndroid.SHORT,
    );
  };

  const addNewToolToUser = async (tool: Tool, toolIds: string[]) => {
    const newTool = {
      ...tool,
      materials: [newMaterial._id],
    };
    await addToolToUser(newTool);
    toolIds.push(newTool._id);
  };

  const handleAddMaterial = async () => {
    try {
      if (materials.length > 0) {
        if (materials.some(m => m.name === newMaterial.name)) {
          showDuplicateMaterialToast();
          return;
        }
      }
      const toolIds: string[] = [];
      if (tools) {
        for (const tool of toolInputs) {
          if (tools.length > 0) {
            const existingTool = tools.find(t => t.name === tool.name);
            if (existingTool) {
              if (existingTool.materials.length === 4) {
                ToastAndroid.show(
                  `${existingTool.name} hat bereits die maximale Anzahl an Materialien erreicht`,
                  ToastAndroid.SHORT,
                );
                continue;
              }
              // Update the existing tool with the new tool ID
              await updateToolFromUser(existingTool._id, {
                ...existingTool,
                materials: [...existingTool.materials, newMaterial._id],
              });
              toolIds.push(existingTool._id);
            } else {
              // Add the new tool to the user
              await addNewToolToUser(tool, toolIds);
            }
          } else {
            // Add the new tool to the user
            await addNewToolToUser(tool, toolIds);
          }
        }
      }

      const newMaterialWithIds = {
        ...newMaterial,
        tools: toolIds,
      };

      await addMaterialToUser(newMaterialWithIds);
      setNewMaterial(getInitialState());
      setIsAddItemModalVisible(false);
      setToolInputs([]);
      ToastAndroid.show(
        `${newMaterial.name} erfolgreich hinzugefügt`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      console.log('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const material: Tool = await get_Material(id);
      if (tools.length > 0) {
        for (const tool of tools) {
          const newMaterialsForTool = tool.materials.filter(
            materialId => material._id !== materialId,
          );
          await updateToolFromUser(tool._id, {
            ...tool,
            materials: newMaterialsForTool,
          });
        }
      }
      await deleteMaterialFromUser(id);
      ToastAndroid.show(
        `${material.name} erfolgreich gelöscht`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      console.log('Error deleting material:', error);
    }
  };

  const handleInputChange = (
    name: string,
    value: string,
    index: number | null = null,
  ) => {
    if (index !== null) {
      const updatedTools: Tool[] = [...toolInputs];
      updatedTools[index].name = value;
      setToolInputs(updatedTools);
      setNewMaterial({
        ...newMaterial,
        tools: updatedTools.map(tool => tool._id),
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
    setNewMaterial({...newMaterial, tools: updatedTools.map(tool => tool._id)});
  };

  const renderModalFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={listStyles.textInput}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newMaterial.name || ''}
        />
        <TextInput
          key="description"
          style={listStyles.textInput}
          placeholder="Beschreibung"
          onChangeText={text => handleInputChange('description', text)}
          value={newMaterial.description || ''}
        />
        <Text style={listStyles.toolTitle}>Werkzeuge</Text>
        {toolInputs.map((tool: Tool, index: number) => (
          <View key={`${tool._id}`} style={listStyles.toolInputContainer}>
            <TextInput
              style={listStyles.textInput}
              placeholder="Name des Werkzeugs"
              onChangeText={text => handleInputChange('tools', text, index)}
              value={tool.name || ''}
            />
            <TouchableOpacity
              style={{paddingLeft: 7}}
              onPress={() => removeToolInput(index)}>
              <Ionicons name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={listStyles.addToolButtonContainer}>
          {toolInputs.length < 4 ? (
            <Button
              title={'Werkzeug hinzufügen'}
              onPress={addToolInput}
              color={'green'}
            />
          ) : null}
        </View>
      </>
    );
  };

  const filterMaterials = useCallback(
    (materialsForFilter: Material[], filterValue: string) => {
      if (materialsForFilter.length > 0) {
        return materialsForFilter.filter(material =>
          material.name.toLowerCase().includes(filterValue.toLowerCase()),
        );
      }
    },
    [],
  );

  const filteredMaterials = useMemo(() => {
    return filterMaterials(materials, filterValue);
  }, [materials, filterValue, filterMaterials]);

  const renderMaterial = ({item}: {item: Material}) => (
    <Pressable
      key={item._id}
      onPress={() =>
        //@ts-ignore
        navigation.navigate('Detail-Ansicht', {item: item, type: 'Material'})
      }>
      <ListItem
        key={item._id}
        item={item}
        onDeleteItem={handleDeleteMaterial}
      />
    </Pressable>
  );

  return (
    <>
      <View style={listStyles.filterContainer}>
        <TextInput
          style={listStyles.filterInput}
          placeholder="Nach Materialien filtern..."
          onChangeText={text => setFilterValue(text)}
          value={filterValue}
        />
      </View>
      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterial}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={item => item._id}
        style={{paddingTop: 20}}
        ListFooterComponent={<View style={{height: 100}} />}
      />
      <CustomFAB action={() => setIsAddItemModalVisible(true)} />
      <CustomModal
        title="Neues Material hinzufügen"
        fields={renderModalFields()}
        action={() => {
          setIsAddItemModalVisible(false);
          setToolInputs([]);
        }}
        modalVisible={isAddItemModalVisible}
        buttonPressAction={handleAddMaterial}
        deleteAction={false}
        buttonDisabled={newMaterial.name === ''}
      />
    </>
  );
};

export default MaterialList;
