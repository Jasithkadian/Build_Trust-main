import json
import os

class UserDB:
    def __init__(self):
        self.file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../local_users.json'))
        self.users = self._load_users()

    def _load_users(self):
        users = {}
        # 1. Load packaged users (default)
        packaged_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../local_users.json'))
        if os.path.exists(packaged_path):
            try:
                with open(packaged_path, 'r') as f:
                    data = json.load(f)
                    if data:
                        users.update(data)
            except:
                pass
                
        # 2. Load /tmp users (session updates) and merge
        tmp_path = '/tmp/local_users.json'
        if os.path.exists(tmp_path):
            try:
                with open(tmp_path, 'r') as f:
                    data = json.load(f)
                    if data:
                        users.update(data)
            except:
                pass
        return users

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

