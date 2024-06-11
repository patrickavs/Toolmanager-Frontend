import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Tool from './Tool.ts';
import Material from './Material.ts';
import ObjectID from 'bson-objectid';
import {useItemsContext} from '../context/ItemsContext.tsx';
import {useUserContext} from '../context/UserContext.tsx';
import {
  get_Material,
  get_Materials_For_User,
  get_Tool,
  get_Tools_For_User,
} from '../service/api.ts';

const DetailView = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {item, type} = route.params;
  const {fetchTool, fetchMaterial} = useItemsContext();
  const {
    addMaterialToUser,
    addToolToUser,
    user,
    updateMaterialFromUser,
    updateToolFromUser,
    tools,
    materials,
  } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [inputs, setInputs] = useState<any[]>([]);
  const [tempInputs, setTempInputs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (type === 'Tool') {
        const fetchedMaterials: Material[] = await Promise.all(
          item.materials.map((materialId: string) => fetchMaterial(materialId)),
        );
        setInputs(fetchedMaterials);
      } else if (type === 'Material') {
        const fetchedTools: Tool[] = await Promise.all(
          item.tools.map((toolId: string) => fetchTool(toolId)),
        );
        setInputs(fetchedTools);
      }
    };

    fetchDetails();
  }, [item, type, fetchMaterial, fetchTool]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      if (type === 'Tool') {
        if (editedItem.name === '') {
          ToastAndroid.show('Please fill in a name', ToastAndroid.SHORT);
          setIsEditing(true);
          return;
        }
        const sameNameAlreadyInTools = tools.find(
          (tool: Tool) =>
            tool.name === editedItem.name && tool._id !== editedItem._id,
        );
        if (sameNameAlreadyInTools) {
          ToastAndroid.show(
            `${editedItem.name} is already in the list. Give another name instead`,
            ToastAndroid.SHORT,
          );
          setIsEditing(true);
          return;
        }
        const materialIds = await handleMaterialsUpdate();

        await updateToolFromUser(item._id, {
          ...editedItem,
          materials: materialIds,
        });

        const updatedTool: Tool = await get_Tool(item._id);
        setEditedItem(updatedTool);
        await fetchTool(item._id);
      } else if (type === 'Material') {
        if (editedItem.name === '') {
          ToastAndroid.show('Please fill in a name', ToastAndroid.SHORT);
          setIsEditing(true);
          return;
        }
        const sameNameAlreadyInMaterials = materials.find(
          (material: Material) =>
            material.name === editedItem.name &&
            material._id !== editedItem._id,
        );
        if (sameNameAlreadyInMaterials) {
          ToastAndroid.show(
            `${editedItem.name} is already in the list. Give another name instead`,
            ToastAndroid.SHORT,
          );
          setIsEditing(true);
          return;
        }
        const toolIds = await handleToolsUpdate();

        await updateMaterialFromUser(item._id, {
          ...editedItem,
          tools: toolIds,
        });

        const updatedMaterial: Material = await get_Material(item._id);
        setEditedItem(updatedMaterial);
        await fetchMaterial(item._id);
      }

      ToastAndroid.show('Changes saved', ToastAndroid.SHORT);
      console.log('Updated item:', editedItem);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleMaterialsUpdate = async () => {
    // TODO: Maybe better to just use already declared materials from the context
    const fetchedMaterials: Material[] = await get_Materials_For_User(
      user?.email || '',
    );
    const materialIds: string[] = [];

    for (const material of [...inputs, ...tempInputs] as Material[]) {
      if (!material.name.trim()) {
        continue;
      } // Skip empty material names

      const materialExists = fetchedMaterials.find(
        materialListMaterial => material.name === materialListMaterial.name,
      );

      if (!materialExists) {
        const newMaterial = {
          ...material,
          _id: ObjectID().toHexString(),
          tools: [item._id],
        };
        await addMaterialToUser(newMaterial);
        materialIds.push(newMaterial._id);
      } else {
        if (!materialExists.tools.includes(item._id)) {
          if (materialExists.tools.length === 4) {
            ToastAndroid.show(
              `${materialExists.name} has already reached the limit of tools`,
              ToastAndroid.SHORT,
            );
            setTempInputs([]);
            continue;
          }
          const updatedMaterial = {
            ...materialExists,
            tools: [...materialExists.tools, item._id],
          };
          await updateMaterialFromUser(materialExists._id, updatedMaterial);
        }
        materialIds.push(materialExists._id);
      }
    }
    return materialIds;
  };

  const handleToolsUpdate = async () => {
    // TODO: Maybe better to just use already declared tools from the context
    const fetchedTools: Tool[] = await get_Tools_For_User(user?.email || '');
    const toolIds: string[] = [];

    for (const tool of [...inputs, ...tempInputs] as Tool[]) {
      if (!tool.name.trim()) {
        continue;
      } // Skip empty tool names

      const toolExists = fetchedTools.find(
        toolListTool => tool.name === toolListTool.name,
      );

      if (!toolExists) {
        const newTool = {
          ...tool,
          _id: ObjectID().toHexString(),
          materials: [item._id],
        };
        await addToolToUser(newTool);
        toolIds.push(newTool._id);
      } else {
        if (!toolExists.materials.includes(item._id)) {
          if (toolExists.materials.length === 4) {
            ToastAndroid.show(
              `${toolExists.name} has already reached the limit of materials`,
              ToastAndroid.SHORT,
            );
            setTempInputs([]);
            continue;
          }
          const updatedTool = {
            ...toolExists,
            materials: [...toolExists.materials, item._id],
          };
          await updateToolFromUser(toolExists._id, updatedTool);
        }
        toolIds.push(toolExists._id);
      }
    }
    return toolIds;
  };

  const handleInputChange = (name: string, value: string) => {
    setEditedItem({...editedItem, [name]: value});
  };

  const handleItemChange = (
    index: number,
    value: string,
    isTemp: boolean = false,
  ) => {
    const updatedInputs = isTemp ? [...tempInputs] : [...inputs];
    updatedInputs[index].name = value;
    isTemp ? setTempInputs(updatedInputs) : setInputs(updatedInputs);
  };

  const addItemInput = () => {
    let newItem: any;
    if (type === 'Tool') {
      newItem = {
        _id: ObjectID().toHexString(),
        name: '',
        tools: [item._id],
        description: '',
      };
    } else {
      newItem = {
        _id: ObjectID().toHexString(),
        name: '',
        materials: [item._id],
        description: '',
      };
    }
    setTempInputs([...tempInputs, newItem]);
  };

  const removeTempInput = (index: number) => {
    const updatedTempInputs = tempInputs.filter(
      (_: any, i: number) => i !== index,
    );
    setTempInputs(updatedTempInputs);
  };

  const removeItemInput = async (index: number) => {
    const updatedInputs = inputs.filter((_: any, i: number) => i !== index);
    const removedItem = inputs[index];

    if (type === 'Tool') {
      const updatedTool = {
        ...editedItem,
        materials: updatedInputs.map((input: Material) => input._id),
      };
      setEditedItem(updatedTool);
      await updateToolFromUser(item._id, updatedTool);

      const updatedMaterial = {
        ...removedItem,
        tools: removedItem.tools.filter(
          (toolId: string) => toolId !== item._id,
        ),
      };
      await updateMaterialFromUser(removedItem._id, updatedMaterial);
    } else if (type === 'Material') {
      const updatedMaterial = {
        ...editedItem,
        tools: updatedInputs.map((input: Tool) => input._id),
      };
      setEditedItem(updatedMaterial);
      await updateMaterialFromUser(item._id, updatedMaterial);

      const updatedTool = {
        ...removedItem,
        materials: removedItem.materials.filter(
          (materialId: string) => materialId !== item._id,
        ),
      };
      await updateToolFromUser(removedItem._id, updatedTool);
    }

    setInputs(updatedInputs);
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
            <Text style={styles.title}>{editedItem.name}</Text>
          )}
          <TouchableOpacity
            onPress={isEditing ? handleSave : handleEdit}
            style={styles.editButton}>
            <Ionicons
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
          <Text style={styles.description}>{editedItem.description}</Text>
        )}
        {type === 'Tool' && (
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
                      <Ionicons
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
            {tempInputs.map((material: Material, index: number) => (
              <View key={material._id} style={styles.inputContainer}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.textInput}
                      value={material.name}
                      onChangeText={text => handleItemChange(index, text, true)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeTempInput(index)}>
                      <Ionicons
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
            {(isEditing && tempInputs.length + item.materials.length < 4) ||
            (!isEditing && item.materials.length > 4) ? (
              <Button
                title="Add Material"
                onPress={addItemInput}
                color="green"
              />
            ) : null}
          </View>
        )}
        {type === 'Material' && (
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
                      <Ionicons
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
            {tempInputs.map((tool: Tool, index: number) => (
              <View key={tool._id} style={styles.inputContainer}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.textInput}
                      value={tool.name}
                      onChangeText={text => handleItemChange(index, text, true)}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeTempInput(index)}>
                      <Ionicons
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
            {(isEditing && tempInputs.length + item.tools.length < 4) ||
            (!isEditing && item.tools.length > 4) ? (
              <Button title="Add Tool" onPress={addItemInput} color="green" />
            ) : null}
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
    width: 100,
    display: 'flex',
    alignSelf: 'center',
  },
});

export default DetailView;
