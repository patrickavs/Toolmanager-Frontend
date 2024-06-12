import {StyleSheet} from 'react-native';

export const listStyles = StyleSheet.create({
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
  materialTitle: {
    fontSize: 17,
    paddingVertical: 10,
  },
  addMaterialButtonContainer: {
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  materialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
    elevation: 3,
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
});
