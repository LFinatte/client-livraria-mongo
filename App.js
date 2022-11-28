import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    Button
} from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from './src/components/ModalView';
import PostCardItem from './src/components/PostCardItem';
import api from './src/services/api'


export default function App() {

    const [data, setDate] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [bookId, setBookId] = useState(0);
    const [publishDate, setPublishDate] = useState('');
    const [subject, setSubject] = useState('');
    const [cover, setCover] = useState('');
    const [loading, setLoading] = useState(false);

    const getBook = async () => {
        await api.get('/book')
            .then((res) => setDate(res.data))
            .catch(e => {console.log(e)})
    }

    useEffect(() => {
        getBook().then(r => r);
    }, [])

    const createBook = async (title, publishDate, author, subject, cover) => {
        await api.post('/book', {
            title,
            publishDate,
            author,
            subject,
            cover
        }).then(() => updateBook())
    }

    const deleteBook = async (id) => {
        await api.delete(`/book/${id}`).then(() => updateBook());
    }

    const edit = async (id, title, publishDate, author, subject, cover) => {
        setVisible(true)
        setBookId(id)
        setTitle(title)
        setAuthor(author)
        setPublishDate(publishDate)
        setSubject(subject)
        setCover(cover)
    }

    const editBook = async (id, title, publishDate, author, subject, cover) => {
        await api.put(`/book/${id}`, {
            title,
            publishDate,
            author,
            subject,
            cover
        }).then(() => updateBook())
    }

    const updateBook = () => {
        getBook().then(r => r)
        setVisible(false);
        setAuthor('')
        setTitle('')
        setCover('')
        setSubject('')
        setPublishDate('')
        setBookId(0)
    }

    return (
        <SafeAreaView>
            <StatusBar style="auto" />
            <Surface style={styles.header}>
                <Title>Books</Title>
                <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                    <Text style={styles.buttonText}>Add book</Text>
                </TouchableOpacity>
            </Surface>
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id + index.toString()}
                refreshing={loading}
                onRefresh={getBook}
                renderItem={({ item }) => (
                    <PostCardItem
                        title={item.title}
                        author={item.author}
                        publishDate={item.publishDate}
                        subject={item.subject}
                        cover={item.cover}
                        onEdit={() => edit(item._id, item.title, item.publishDate,  item.author, item.subject, item.cover)}
                        onDelete={() => deleteBook(item._id)}
                    />
                )}
            />
            <ModalView
                visible={visible}
                title="Add Book"
                onDismiss={() => setVisible(false)}
                onSubmit={() => {
                    if (bookId && title && author && publishDate && subject && cover) {
                        editBook(bookId, title, publishDate, author, subject, cover).then(r => r)
                    } else {
                        createBook(title, publishDate, author, subject, cover).then(r => r)
                    }
                }}
                cancelable
            >
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Publish Date"
                    value={publishDate}
                    onChangeText={(text) => setPublishDate(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Author"
                    value={author}
                    onChangeText={(text) => setAuthor(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Subject"
                    value={subject}
                    onChangeText={(text) => setSubject(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Cover"
                    value={cover}
                    onChangeText={(text) => setCover(text)}
                    mode="outlined"
                />
            </ModalView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    header: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        padding: 16,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'steelblue',
    },
    buttonText: {
        color: 'white'
    },
});
