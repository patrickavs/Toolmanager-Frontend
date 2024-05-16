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

interface ListItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, data: Partial<any>) => void;
  itemInput: Array<any>;
  onClick: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  onDeleteItem,
  onUpdateItem,
  itemInput,
  onClick,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [inputs, setInputs] = useState<any>([]);

  if ('materials' in item) {
  }

  const handleInputChange = (
    name: string,
    value: string,
    index: number | null = null,
  ) => {
    if (name === 'materials' && index !== null) {
      const updatedMaterials: any[] = [...inputs];
      updatedMaterials[index].name = value;
      setInputs(updatedMaterials);
      setNewItem({
        ...newItem,
        materials: updatedMaterials,
      });
    } else {
      setNewItem({...newItem, [name]: value});
    }
  };

  // TODO: Adjust materials/items input for Tool/Material
  const renderFieldsUpdate = () => {
    return (
      <>
        <TextInput
          key="name"
          style={styles.textInput}
          onChangeText={text => setNewItem({...newItem, name: text})}
          value={item.name || ''}
        />
        <TextInput
          key="description"
          style={styles.textInput}
          placeholder="Description"
          onChangeText={text => setNewItem({...newItem, description: text})}
          value={item.description || ''}
        />
        <Text style={styles.itemTitle}>Materials</Text>
        {itemInput.map((mapItem: any, index: number) => (
          <View key={`${mapItem._id}`} style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Material Name"
              onChangeText={text => handleInputChange('materials', text, index)}
              value={mapItem.name || ''}
            />
            <TouchableOpacity
              style={{paddingLeft: 7}}
              onPress={() => removeMaterialInput(index)}>
              <Ionicon name="remove-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addItemButtonContainer}>
          <Button
            title={'Add Material'}
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
            buttonPressAction={() =>
              onUpdateItem(item._id, {name: 'Updated Item'})
            }
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
