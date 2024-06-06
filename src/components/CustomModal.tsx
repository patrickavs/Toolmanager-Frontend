import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';

interface CustomModalProps {
  title: string;
  fields: React.JSX.Element;
  action: () => void;
  modalVisible: boolean;
  buttonPressAction: () => void;
  deleteAction: boolean;
  buttonDisabled: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  title = 'New Title',
  fields,
  action,
  modalVisible,
  buttonPressAction,
  deleteAction,
  buttonDisabled = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => action()}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          {fields}
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => action()} />
            {deleteAction ? (
              <Button
                title={'Delete'}
                color={'red'}
                onPress={buttonPressAction}
              />
            ) : (
              <Button
                title="Save"
                onPress={buttonPressAction}
                disabled={buttonDisabled}
              />
            )}
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
    marginBottom: 100,
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
