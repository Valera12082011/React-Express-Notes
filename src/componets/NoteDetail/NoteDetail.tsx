import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Интерфейс для заметки
interface Note {
    id: number;
    title: string;
    description: string;
    time: string;
}

function NoteDetail() {
    const { id } = useParams<{ id: string }>(); // Получение ID из параметров URL
    const [note, setNote] = useState<Note | null>(null); // Состояние для хранения заметки
    const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
    const [error, setError] = useState<string | null>(null); // Состояние для обработки ошибок

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`http://localhost:3000/get_by_id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: parseInt(id) }),
                });
                const result = await response.json();

                if (response.ok) {
                    setNote(result.note);
                } else {
                    setError(result.error || 'Error fetching note');
                }
            } catch (error) {
                setError('Error fetching note');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!note) {
        return <div>No note found</div>;
    }

    return (
        <div>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <p><strong>Created at:</strong> {note.time}</p>
        </div>
    );
}

export default NoteDetail;
