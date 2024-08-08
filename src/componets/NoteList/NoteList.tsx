import React, { Component } from 'react';
import { Reorder } from 'framer-motion';
import styles from './NoteList.module.css';

// Интерфейсы
interface Note {
    id: number;
    title: string;
    description: string;
    time: string;
}

interface Input {
    title: string;
    description: string;
}

interface State {
    input: Input;
    NotesList: Array<Note>;
}

// Компонент
class NoteList extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            input: { title: '', description: '' }, // Инициализация как объект Input
            NotesList: []
        };
    }

    // Метод для добавления заметки
    addNote = async (newNote: Note) => {
        try {
            const response = await fetch('http://localhost:3000/add_note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });
            const result = await response.json();
            if (response.ok) {
                this.setState((prevState) => ({
                    NotesList: [...prevState.NotesList, result],
                }));
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    // Метод для удаления заметки
    deleteNote = async (id: number) => {
        try {
            const response = await fetch('http://localhost:3000/delete_note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            const result = await response.json();
            if (response.ok) {
                this.setState((prevState) => ({
                    NotesList: prevState.NotesList.filter(note => note.id !== id),
                }));
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    // Метод для получения всех заметок
    fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:3000/get_all_notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                this.setState({ NotesList: result.notes });
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    // Метод для обработки изменения полей ввода
    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            input: {
                ...prevState.input,
                [name]: value
            }
        }));
    };

    // Метод для обработки переупорядочивания заметок
    handleReorder = (newOrder: Note[]) => {
        this.setState({ NotesList: newOrder });
    };

    // Метод для добавления новой заметки при нажатии кнопки
    handleAddClick = () => {
        const { title, description } = this.state.input;
        const newNote: Note = {
            id: Date.now(), // или любой другой метод генерации ID
            title,
            description,
            time: new Date().toLocaleTimeString(),
        };
        this.addNote(newNote);
        this.setState({ input: { title: '', description: '' } });
    };

    componentDidMount() {
        this.fetchNotes();
    }

    render() {
        const { input, NotesList } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.AddNewNote}>
                    <input
                        name="title"
                        placeholder="Enter title"
                        value={input.title}
                        onChange={this.handleInputChange}
                    />
                    <input
                        name="description"
                        placeholder="Enter description"
                        value={input.description}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleAddClick}>
                        Add Note
                    </button>
                </div>

                <Reorder.Group
                    axis="y"
                    values={NotesList}
                    onReorder={this.handleReorder}
                    className={styles.list}
                >
                    {NotesList.map((note) => (
                        <Reorder.Item
                            key={note.id}
                            value={note}
                            className={styles.ItemNote}
                        >
                            <p onClick={() => document.location.href = `/note/${note.id}`}>{note.title} - {note.description} - {note.id} - {note.time}</p>
                            <button onClick={() => this.deleteNote(note.id)}>Delete</button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        );
    }
}

export default NoteList;
