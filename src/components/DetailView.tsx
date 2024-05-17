import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Tool from './Tool.ts';
import Material from './Material.ts';
import ObjectID from 'bson-objectid';

const DetailView = ({route}: {route: any}) => {
  const {item, itemType} = route.params;
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [inputs, setInputs] = useState(
    itemType === 'Tool' ? item.materials : item.tools,
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here, e.g., update the state, make API calls, etc.
    console.log('Updated item:', editedItem);
  };

  const handleInputChange = (name: string, value: string) => {
    setEditedItem({...editedItem, [name]: value});
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].name = value;
    setInputs(updatedInputs);
    setEditedItem({
      ...editedItem,
      [itemType === 'Tool' ? 'materials' : 'tools']: updatedInputs,
    });
  };

  const addItemInput = () => {
    const newItem = {
      _id: ObjectID().toHexString(),
      name: '',
      description: '',
    };
    setInputs([...inputs, newItem]);
  };

  const removeItemInput = (index: number) => {
    const updatedInputs = inputs.filter((_: any, i: number) => i !== index);
    setInputs(updatedInputs);
    setEditedItem({
      ...editedItem,
      [itemType === 'Tool' ? 'materials' : 'tools']: updatedInputs,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={editedItem.name}
              onChangeText={text => handleInputChange('name', text)}
            />
          ) : (
            <Text style={styles.title}>{item.name}</Text>
          )}
          <TouchableOpacity
            onPress={isEditing ? handleSave : handleEdit}
            style={styles.editButton}>
            <Ionicon
              name={isEditing ? 'checkmark-outline' : 'pencil-outline'}
              size={24}
              color="blue"
            />
          </TouchableOpacity>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.descriptionInput}
            value={editedItem.description}
            onChangeText={text => handleInputChange('description', text)}
            multiline
          />
        ) : (
          <Text style={styles.description}>{item.description}</Text>
        )}
        {itemType === 'Tool' && (
          <View>
            <Text style={styles.sectionTitle}>Materials:</Text>
            {inputs.map((material: Material, index: number) => (
              <View key={material._id} style={styles.inputContainer}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.textInput}
                      value={material.name}
                      onChangeText={text => handleItemChange(index, text)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItemInput(index)}>
                      <Ionicon
                        name="remove-circle-outline"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.material}>{material.name}</Text>
                )}
              </View>
            ))}
            {isEditing && (
              <Button
                title="Add Material"
                onPress={addItemInput}
                color="green"
              />
            )}
          </View>
        )}
        {itemType === 'Material' && (
          <View>
            <Text style={styles.sectionTitle}>Tools:</Text>
            {inputs.map((tool: Tool, index: number) => (
              <View key={tool._id} style={styles.inputContainer}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.textInput}
                      value={tool.name}
                      onChangeText={text => handleItemChange(index, text)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItemInput(index)}>
                      <Ionicon
                        name="remove-circle-outline"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.tool}>{tool.name}</Text>
                )}
              </View>
            ))}
            {isEditing && (
              <Button title="Add Tool" onPress={addItemInput} color="green" />
            )}
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          color="#1E90FF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  editButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginTop: 10,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  material: {
    fontSize: 16,
    color: '#555',
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tool: {
    fontSize: 16,
    color: '#555',
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  deleteButton: {
    paddingLeft: 7,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default DetailView;
