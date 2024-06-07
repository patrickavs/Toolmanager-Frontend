import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  TextInput,
  View,
  StyleSheet,
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
  const {addMaterialToUser, deleteMaterialFromUser, addToolToUser, tools} =
    useUserContext();
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
    ToastAndroid.showWithGravity(
      'A material with the same name already exists.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const showDuplicateToolToast = () => {
    ToastAndroid.showWithGravity(
      'A material with the same name already exists.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const checkIfToolExists = async (name: string) => {
    return tools.some(tool => tool.name === name);
  };

  const handleAddMaterial = async () => {
    try {
      // TODO: Set the _id of the tool matched with the name
      for (const tool of toolInputs) {
        const toolExists = await checkIfToolExists(tool.name);
        if (toolExists) {
          showDuplicateToolToast();
          return;
        }
      }

      for (const material of materials) {
        if (material.name === newMaterial.name) {
          showDuplicateMaterialToast();
          return;
        }
      }

      await addMaterialToUser(newMaterial);
      for (const tool of toolInputs) {
        await addToolToUser(tool);
      }

      setNewMaterial(getInitialState());
      setIsAddItemModalVisible(false);
      setToolInputs([]);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteMaterialFromUser(id);
    } catch (error) {
      console.error('Error deleting material:', error);
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
              <Ionicons name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addToolButtonContainer}>
          {toolInputs.length < 4 ? (
            <Button title={'Add Tool'} onPress={addToolInput} color={'green'} />
          ) : null}
        </View>
      </>
    );
  };

  const filterMaterials = useCallback(
    (materials: Material[], filterValue: string) => {
      return materials.filter(material =>
        material.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    },
    [],
  );

  // probably adding sorting

  const filteredMaterials = useMemo(() => {
    return filterMaterials(materials, filterValue);
  }, [materials, filterValue, filterMaterials]);

  const renderMaterial = ({item}: {item: Material}) => (
    <Pressable
      onPress={() =>
        //@ts-ignore
        navigation.navigate('DetailView', {item: item, type: 'Material'})
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
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter materials..."
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
        title="Add New Material"
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

export default MaterialList;
