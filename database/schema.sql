CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(10) NOT NULL,
        CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);