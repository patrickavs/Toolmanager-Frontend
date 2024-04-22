import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import axios from 'axios';
import ListItem from "./ListItemView.tsx";

interface ListProps<T extends Item> {
    title: string;
    data: T[];
    onAddItem: (newItem: T) => void;
    onDeleteItem: (id: string) => void;
    onUpdateItem: (id: string, updatedItem: Partial<T>) => void;
}

const MONGODB_URL = 'mongodb://localhost:27017/';

function CustomList<T extends Item>({ title, data, onAddItem, onDeleteItem, onUpdateItem }: ListProps<T>) {
    const [items, setItems] = useState<T[]>(data || []);

    const fetchData = async () => {
        try {
            const endpoint = title.toLowerCase() === 'tools' ? 'get_tools' : 'get_materials'; // Adapt endpoint based on title
            const response = await axios.get<T[]>(`<span class="math-inline">\{MONGODB\_URL\}</span>{endpoint}`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = async (newItem: T) => {
        try {
            const endpoint = title.toLowerCase() === 'tools' ? 'tools' : 'materials'; // Adapt endpoint based on title
            const response = await axios.post(`<span class="math-inline">\{MONGODB\_URL\}</span>{endpoint}/${newItem.id}`, newItem);
            console.log(`${title} added:`, response.data);
            await fetchData(); // Re-fetch data after adding
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const endpoint = title.toLowerCase() === 'tools' ? 'delete_tool' : 'delete_material'; // Adapt endpoint based on title
            const response = await axios.delete(`<span class="math-inline">\{MONGODB\_URL\}</span>{endpoint}/${id}`);
            console.log(`${title} deleted:`, response.data);
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleUpdate = async (id: string, updatedItem: Partial<T>) => {
        try {
            const endpoint = title.toLowerCase() === 'tools' ? 'update_tool' : 'update_material'; // Adapt endpoint based on title
            const response = await axios.put(`<span class="math-inline">\{MONGODB\_URL\}</span>{endpoint}/${id}`, updatedItem);
            console.log(`${title} updated:`, response.data);
            const updatedIndex = items.findIndex((item) => item.id === id);
            setItems([
                ...items.slice(0, updatedIndex),
                { ...items.slice(updatedIndex)[0], ...updatedItem },
                ...items.slice(updatedIndex + 1),
            ]);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const renderItem = ({ item }: { item: T }) => <ListItem item={item} onDeleteItem={handleDelete} onUpdateItem={handleUpdate} />;

    return (
        <View>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>{title}</Text>
            <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />
            <Button title="Add Item" onPress={() => handleAddItem()} />
        </View>
    );
}

export default CustomList;
