import {Button, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const CustomModal = (
  fields: React.JSX.Element,
  action: () => void,
  modalVisible: boolean,
  buttonAction: () => void,
) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => action()}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Tool</Text>
          {fields}
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => action()} />
            <Button title="Save" onPress={buttonAction} />
          </View>
        </View>
      </View>
    </Modal>
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
