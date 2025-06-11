-- Clean up expired sessions (run this periodically)
DELETE FROM sessions WHERE expires_at < NOW();
