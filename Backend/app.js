var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
// Middleware для парсинга JSON-данных
app.use(bodyParser.json());
app.use(cors())
// Создание и подключение к базе данных SQLite
var db = new sqlite3.Database('DataBase2.db');

// Создание таблицы заметок с обновленной структурой
db.serialize(function() {
    db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, time TEXT)");
});

// Обработка добавления новой заметки
app.post('/add_note', function(req, res) {
    var { title, description, time } = req.body;

    if (!title || !description || !time) {
        return res.status(400).json({ error: 'Title, description, and time are required' });
    }

    db.run("INSERT INTO notes (title, description, time) VALUES (?, ?, ?)", [title, description, time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, description, time });
    });
});

// Обработка удаления заметки
app.post("/delete_note", function(req, res) {
    var { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    db.run("DELETE FROM notes WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted' });
    });
});

// Обработка обновления заметки
app.post("/update_note", function(req, res) {
    var { id, title, description, time } = req.body;

    if (!id || (!title && !description && !time)) {
        return res.status(400).json({ error: 'ID, title, description, or time are required' });
    }

    var updates = [];
    var params = [];

    if (title) {
        updates.push("title = ?");
        params.push(title);
    }
    if (description) {
        updates.push("description = ?");
        params.push(description);
    }
    if (time) {
        updates.push("time = ?");
        params.push(time);
    }
    params.push(id);

    db.run(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json({ message: 'Note updated' });
    });
});

// Обработка получения всех заметок
app.post("/get_all_notes", function(req, res) {
    db.all("SELECT * FROM notes", function(err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ notes: rows });
    });
});

app.post("/get_by_id", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json({ note: row });
    });
});


// Запуск сервера
var port = 3000;
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});
