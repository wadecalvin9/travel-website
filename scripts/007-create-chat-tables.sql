-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT, -- Optional: Link to users table if user is logged in
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- e.g., 'active', 'resolved', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message TEXT
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL, -- 'user' or 'agent'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE
);

-- Add an index to session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

-- Add an index to created_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Optional: Add a trigger to update last_message_at in chat_sessions when a new message is added
CREATE OR REPLACE FUNCTION update_chat_session_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions
    SET last_message_at = NEW.created_at,
        last_message = NEW.content
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_chat_session_last_message_at
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_last_message_at();
