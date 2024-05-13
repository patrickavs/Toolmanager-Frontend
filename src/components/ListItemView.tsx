import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ListItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, data: Partial<any>) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  onDeleteItem,
  onUpdateItem,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderInputFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={{
            borderWidth: 1,
            padding: 5,
            marginVertical: 10,
            borderRadius: 5,
          }}
          onChangeText={text => (item.name = text)}
          value={item.name || ''}
        />
        <TextInput
          key="description"
          style={{
            borderWidth: 1,
            padding: 5,
            marginVertical: 10,
            borderRadius: 5,
          }}
          placeholder="Description"
          onChangeText={text => (item.description = text)}
          value={item.description || ''}
        />
        <TextInput
          key="materials"
          style={{
            borderWidth: 1,
            padding: 5,
            marginVertical: 10,
            borderRadius: 5,
          }}
          placeholder="Materials"
          onChangeText={text => {
            if ('materials' in item) {
              item.materials = text;
            } else if ('tools' in item) {
              item.tools = text;
            }
          }}
          value={
            'materials' in item
              ? item.materials.join(', ') || ''
              : 'tools' in item
              ? item.tools.join(', ') || ''
              : ''
          }
        />
      </>
    );
  };

  return (
    <View
      key={item._id}
      style={{
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
      }}>
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
        <TouchableOpacity onPress={() => onDeleteItem(item._id)}>
          <Ionicons
            name="trash-outline"
            size={24}
            color="red"
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Tool</Text>
            {renderInputFields()}
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title="Save"
                onPress={() => onUpdateItem(item._id, {name: 'Updated Item'})}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
});

export default ListItem;
