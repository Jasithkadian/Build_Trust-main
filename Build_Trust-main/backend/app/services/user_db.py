import json
import os

class UserDB:
    def __init__(self):
        self.file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../local_users.json'))
        self.users = self._load_users()

    def _load_users(self):
        # Check /tmp first, then default path
        tmp_path = '/tmp/local_users.json'
        for path in [tmp_path, self.file_path]:
            if os.path.exists(path):
                try:
                    with open(path, 'r') as f:
                        data = json.load(f)
                        if data:
                            # If we successfully read from a path, pin that path for saving if writable
                            self.file_path = path
                            return data
                except:
                    pass
        return {}

    def _save_users(self):
        try:
            with open(self.file_path, 'w') as f:
                json.dump(self.users, f, indent=4)
        except (IOError, OSError):
            # Fallback to /tmp if read-only filesystem (e.g. Vercel)
            tmp_path = '/tmp/local_users.json'
            try:
                with open(tmp_path, 'w') as f:
                    json.dump(self.users, f, indent=4)
                self.file_path = tmp_path
            except Exception as e:
                print(f"❌ Failed to save users even in /tmp: {e}")

    def get_user(self, email):
        return self.users.get(email.lower().strip())

    def create_user(self, email, password_hash, role, full_name):
        email = email.lower().strip()
        self.users[email] = {
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "name": full_name,
            "created_at": "now"
        }
        self._save_users()
        return self.users[email]

user_db = UserDB()

