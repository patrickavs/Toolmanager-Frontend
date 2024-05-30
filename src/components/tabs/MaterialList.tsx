import React, {useState} from 'react';
import {
  FlatList,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import ListItem from '../ListItemView.tsx';
import Material from '../Material.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';
import {CustomModal} from '../CustomModal.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tool from '../Tool.ts';
import {useNavigation} from '@react-navigation/native';
import {useItemsContext} from '../../context/ItemsContext.tsx';
import {useUserContext} from '../../context/UserContext.tsx';
import useMaterials from '../hooks/useMaterials.ts';

const initialState: Material = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  tools: [],
};

const MaterialList = () => {
  const navigation = useNavigation();
  const materials = useMaterials();
  const {fetchMaterials} = useUserContext();
  const {addMaterial, deleteMaterial} = useItemsContext();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>(initialState);
  const [toolInputs, setToolInputs] = useState<Tool[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMaterials().then(() => setRefreshing(false));
  };

  const handleAddMaterial = async () => {
    try {
      await addMaterial(newMaterial);
      setIsAddItemModalVisible(false);
      setNewMaterial(initialState);
      setToolInputs([]);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteMaterial(id);
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
          <Button title={'Add Tool'} onPress={addToolInput} color={'green'} />
        </View>
      </>
    );
  };

  const renderMaterial = ({item}: {item: Material}) => (
    <TouchableOpacity
      onPress={() =>
        //@ts-ignore
        navigation.navigate('DetailView', {item: item, type: 'Material'})
      }>
      <ListItem
        key={item._id}
        item={item}
        onDeleteItem={handleDeleteMaterial}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={materials}
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
