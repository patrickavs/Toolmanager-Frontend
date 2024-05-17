import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomModal} from './CustomModal.tsx';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Material from './Material.ts';
import ObjectID from 'bson-objectid';
import Tool from './Tool.ts';

interface ListItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, data: Partial<any>) => void;
  onClick: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  onDeleteItem,
  onUpdateItem,
  onClick,
}) => {
  let initialState = {};
  if ('materials' in item) {
    initialState = {
      _id: item._id,
      name: '',
      description: '',
      materials: [],
    };
  } else {
    initialState = {
      _id: item._id,
      name: '',
      description: '',
      tools: [],
    };
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<any>(initialState);
  const [inputs, setInputs] = useState<any[]>([]);

  const handleInputChange = (
    name: string,
    value: string,
    index: number | null = null,
  ) => {
    if (name === 'materials' && index !== null) {
      const updatedMaterials: Material[] = [...inputs];
      updatedMaterials[index].name = value;
      setInputs(updatedMaterials);
      setNewItem({
        ...newItem,
        materials: updatedMaterials,
      });
    } else if (name === 'tools' && index !== null) {
      const updatedTools: Tool[] = [...inputs];
      updatedTools[index].name = value;
      setInputs(updatedTools);
      setNewItem({...newItem, tools: updatedTools});
    } else {
      setNewItem({...newItem, [name]: value});
    }
  };

  const removeItemInput = (index: number) => {
    const updatedMaterials = inputs.filter((_: any, i: number) => i !== index);
    setInputs(updatedMaterials);
    setNewItem({...newItem, materials: updatedMaterials});
  };

  const addItemInput = () => {
    if ('materials' in item) {
      const newMaterial: Material = {
        _id: ObjectID().toHexString(),
        name: '',
        tools: [],
        description: '',
      };
      setInputs([...inputs, newMaterial]);
    } else {
      const newTool: Tool = {
        _id: ObjectID().toHexString(),
        name: '',
        materials: [],
        description: '',
      };
      setInputs([...inputs, newTool]);
    }
  };
  const renderFieldsUpdate = () => {
    return (
      <>
        <TextInput
          key="name"
          style={styles.textInput}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={item.name || ''}
        />
        <TextInput
          key="description"
          style={styles.textInput}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={item.description || ''}
        />
        {'materials' in item ? (
          <Text style={styles.itemTitle}>Materials</Text>
        ) : (
          <Text style={styles.itemTitle}>Tools</Text>
        )}
        {item.materials &&
          item.materials.map((material: Material, index: number) => (
            <Text key={index}>{material.name}</Text>
          ))}
        {item.tools &&
          item.tools.map((tool: Tool, index: number) => (
            <Text key={index}>{tool.name}</Text>
          ))}
        {inputs.map((mapItem: any, index: number) => (
          <View key={`${mapItem._id}`} style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'materials' in item ? 'Material Name' : 'Tool Name'}
              onChangeText={text => {
                if ('materials' in item) {
                  handleInputChange('materials', text, index);
                } else {
                  handleInputChange('tools', text, index);
                }
              }}
              value={mapItem.name || ''}
            />
            <TouchableOpacity
              style={{paddingLeft: 7}}
              onPress={() => removeItemInput(index)}>
              <Ionicon name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addItemButtonContainer}>
          <Button
            title={'materials' in item ? 'Add Material' : 'Add Tool'}
            onPress={addItemInput}
            color={'green'}
          />
        </View>
      </>
    );
  };
  const renderFieldsDelete = () => {
    return (
      <Text style={styles.deleteFieldText}>
        Are you sure to delete {item.name}?
      </Text>
    );
  };

  const handleUpdateItem = () => {
    const updatedItem = {...item, ...newItem};
    onUpdateItem(item._id, updatedItem);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={onClick}>
        <View key={item._id} style={styles.listItemContainer}>
          <Text style={{fontSize: 15}}>{item.name}</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons
                name="pencil-outline"
                size={24}
                color="blue"
                style={{marginRight: 15}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <Ionicons
                name="trash-outline"
                size={24}
                color="red"
                style={{marginRight: 15}}
              />
            </TouchableOpacity>
          </View>
          <CustomModal
            title={'Update Entry'}
            fields={renderFieldsUpdate()}
            action={() => setModalVisible(false)}
            modalVisible={modalVisible}
            buttonPressAction={() => handleUpdateItem()}
            deleteAction={false}
          />
          <CustomModal
            title={'Warning'}
            fields={renderFieldsDelete()}
            action={() => setDeleteModalVisible(false)}
            modalVisible={deleteModalVisible}
            buttonPressAction={() => onDeleteItem(item._id)}
            deleteAction={true}
          />
        </View>
      </TouchableOpacity>
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
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: 'lightgray',
    elevation: 2,
    borderRadius: 10,
    alignItems: 'center',
    paddingStart: 10,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  deleteFieldText: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 20,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 17,
    paddingVertical: 10,
  },
  addItemButtonContainer: {
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default ListItem;
