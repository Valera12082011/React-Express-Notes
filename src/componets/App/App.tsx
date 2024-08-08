import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from '../NavBar/NavBar'; // Уберите расширение .tsx

// Ленивый импорт компонентов
const NoteList = lazy(() => import('../NoteList/NoteList'));
const NoteDetail = lazy(() => import('../NoteDetail/NoteDetail'));

// Компонент App с ленивой загрузкой
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<NoteList />} />
                    <Route path="/note/:id" element={<NoteDetail />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
