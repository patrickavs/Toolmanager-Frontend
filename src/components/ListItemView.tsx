import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomModal} from './CustomModal.tsx';

interface ListItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({item, onDeleteItem}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const renderFieldsDelete = () => {
    return (
      <Text style={styles.deleteFieldText}>
        Are you sure to delete {item.name}?
      </Text>
    );
  };

  return (
    <>
      <View key={item._id} style={styles.listItemContainer}>
        <Text style={{fontSize: 15}}>{item.name}</Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
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
          title={'Warning'}
          fields={renderFieldsDelete()}
          action={() => setDeleteModalVisible(false)}
          modalVisible={deleteModalVisible}
          buttonPressAction={() => onDeleteItem(item._id)}
          deleteAction={true}
        />
      </View>
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
