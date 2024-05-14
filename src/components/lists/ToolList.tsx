import React, {useState, useEffect} from 'react';
import {
  Button,
  FlatList,
  Text,
  TextInput,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {getTools, addTool, updateTool, removeTool} from '../../service/api.ts';
import ListItem from '../ListItemView.tsx';
import Tool from '../Tool.ts';
import ObjectID from 'bson-objectid';
import {CustomFAB} from '../CustomFAB.tsx';

const initialState: Tool = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  materials: [],
};

const ToolList = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newTool, setNewTool] = useState<Tool>(initialState);

  useEffect(() => {
    fetchTools().then(r => console.log(r));
  }, []);

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

  const handleUpdateTool = async (id: string) => {
    try {
      await updateTool(id, newTool);
      await fetchTools();
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === 'materials') {
      const materialsArray = value.split(',').map(material => material.trim());
      setNewTool({...newTool, [name]: materialsArray});
    } else {
      setNewTool({...newTool, [name]: value});
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
          value={newTool.name || ''}
        />
        <TextInput
          key="description"
          style={styles.textInput}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newTool.description || ''}
        />
        <TextInput
          key="materials"
          style={styles.textInput}
          placeholder="Materials"
          onChangeText={text => handleInputChange('materials', text)}
          value={newTool.materials.join(', ') || [].toString()}
        />
      </>
    );
  };

  const renderTool = ({item}: {item: Tool}) => (
    <ListItem
      item={item}
      onDeleteItem={handleDeleteTool}
      onUpdateItem={handleUpdateTool}
    />
  );

  return (
    <>
      <FlatList
        data={tools}
        renderItem={renderTool}
        keyExtractor={item => item._id}
        ListFooterComponent={<View style={{height: 100}} />}
        style={{paddingTop: 20}}
      />
      <CustomFAB action={() => setIsAddItemModalVisible(true)} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddItemModalVisible}
        onRequestClose={() => setIsAddItemModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Tool</Text>
            {renderInputFields()}
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setIsAddItemModalVisible(false)}
              />
              <Button title="Save" onPress={handleAddTool} />
            </View>
          </View>
        </View>
      </Modal>
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

export default ToolList;
