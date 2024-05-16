import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Tool from './Tool.ts';
import Material from './Material.ts';

const DetailView = ({route}: {route: any}) => {
  const {item, itemType} = route.params;
  const navigation = useNavigation();

  const handleEdit = () => {
    console.log('Edit button pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.name}</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicon name="pencil-outline" size={24} color="blue" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        {itemType === 'Tool' && item.materials && (
          <View>
            <Text style={styles.sectionTitle}>Materials:</Text>
            {item.materials.map((material: Material, index: number) => (
              <Text key={index} style={styles.material}>
                {material.name}
              </Text>
            ))}
          </View>
        )}
        {itemType === 'Material' && item.tools && (
          <View>
            <Text style={styles.sectionTitle}>Tools:</Text>
            {item.tools.map((tool: Tool, index: number) => (
              <Text key={index} style={styles.tool}>
                {tool.name}
              </Text>
            ))}
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
  editButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginTop: 10,
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default DetailView;
