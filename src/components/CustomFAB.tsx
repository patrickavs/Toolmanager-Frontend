import Ionicon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

export function CustomFAB({action}: {action: () => void}) {
  return (
    <TouchableOpacity style={styles.container} onPress={action}>
      <Ionicon name="add" size={30} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 70,
    backgroundColor: 'green',
    borderRadius: 100,
  },
});
