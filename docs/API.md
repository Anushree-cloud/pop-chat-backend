Auth
  POST /auth/register  - body: { email, password, name }
  POST /auth/login     - body: { email, password }
  POST /auth/google    - body: { idToken }
  POST /auth/logout    - body: { refreshToken }

User
  GET /user/me         - auth: Bearer

Chat
  POST /chat/create-room - body: { name, isGroup, memberIds }
  POST /chat/send-message - body: { roomId, content, meta }
  GET /chat/get-messages  - query: roomId, limit, cursor

AI
  POST /ai/send - body: { prompt, model? }
