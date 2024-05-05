import React from 'react';
import {Button, Text, View} from 'react-native';

interface ListItemProps {
  item: any;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, updatedItem: Partial<any>) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  onDeleteItem,
  onUpdateItem,
}) => {
  return (
    <View key={item.id} style={{flexDirection: 'row', marginBottom: 5}}>
      <Text>{item.name}</Text>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <Button title="Delete" onPress={() => onDeleteItem(item.id)} />
        <Button
          title="Update"
          onPress={() => onUpdateItem(item.id, {name: 'Updated Item'})}
        />
      </View>
    </View>
  );
};

export default ListItem;
