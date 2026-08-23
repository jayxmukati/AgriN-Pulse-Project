-- Database Seeding Script for Final Prototype Demo

CREATE TABLE IF NOT EXISTS calendar_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    due_date VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    task_type VARCHAR(100) NOT NULL
);

INSERT INTO calendar_tasks (title, due_date, priority, task_type) VALUES 
('Apply Nitrogen Fertilizer', 'In 3 days', 'High', 'Nutrition'),
('Inspect for Rust Spores', 'In 5 days', 'Medium', 'Scouting'),
('Reduce Irrigation Frequency', 'Next Week', 'Low', 'Water'),
('Harvest Wheat Plot A', 'Next Month', 'High', 'Harvest'),
('Soil Sample Testing', 'In 14 days', 'Medium', 'Analysis')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    time_posted VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL,
    likes INT DEFAULT 0,
    verified_reply_author VARCHAR(255),
    verified_reply_content TEXT
);

INSERT INTO community_posts (author, role, time_posted, content, tags, likes, verified_reply_author, verified_reply_content) VALUES 
('Ramesh Singh', 'Farmer', '2 hours ago', 'Noticed yellowing on the lower leaves of my tomato plants. Could this be early blight?', '#PestControl', 12, 'Dr. Anita Sharma', 'Yes, Ramesh. Given the recent humidity, this is highly likely Early Blight. Please apply a copper-based fungicide and ensure bottom watering to prevent splash-back.'),
('Priya Patel', 'Farmer', '5 hours ago', 'Has anyone received the latest fertilizer subsidy direct benefit transfer? Mine is delayed.', '#Subsidies', 45, NULL, NULL),
('John Doe', 'Farmer', '1 day ago', 'What cover crops are best for restoring nitrogen?', '#Nutrition', 22, 'Ext. Agent Smith', 'Legumes such as clover or vetch are excellent nitrogen fixers.'),
('Anna K', 'Farmer', '3 days ago', 'Is it too late to sow winter wheat?', '#Irrigation', 5, NULL, NULL),
('Dev', 'Agronomist', '4 days ago', 'Remember to calibrate your sprayers before applying pesticides.', '#PestControl', 89, NULL, NULL)
ON CONFLICT DO NOTHING;
