// Separate component for each list item
import {Button, Text, View} from "react-native";
import React from "react";

const ListItem: React.FC<{ item: any; onDeleteItem: (id: string) => void;
    onUpdateItem: (id: string, updatedItem: Partial<any>) => void }> = ({item, onDeleteItem, onUpdateItem}) => (
    <View key={item.id} style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Text>{item.name}</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Button title="Delete" onPress={() => onDeleteItem(item.id)} />
            <Button title="Update" onPress={() => onUpdateItem(item.id, { name: 'Updated Item' })} />
        </View>
    </View>
);

export default ListItem;
