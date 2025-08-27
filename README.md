# Student Electronic Voting System Backend

A robust Django REST API for managing student elections, supporting secure, anonymous voting, role-based access, eligibility restrictions, and comprehensive audit logging.

## Features

- **Role-Based Authentication**: Superadmin, Admin, Polling Agent, and Voter roles
- **Election Management**: Create, update, monitor elections with time controls and results
- **Voter Management**: Bulk upload via Excel, individual creation, OTP authentication
- **Portfolio Restrictions**: Level, gender, and department-based eligibility for voting
- **Anonymous Voting**: Votes are not linked to voter identity for privacy
- **Real-Time Results**: Live vote counting and result display
- **Audit Logging**: All actions logged for security and traceability
- **Security**: Strict permissions, OTP authentication, session and IP tracking

## Installation

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Apply migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create a superadmin user:**

   ```bash
   python scripts/create_superuser.py
   ```

4. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login/` — User login (admin, polling agent)
- `POST /api/auth/voter_login/` — Voter login with OTP
- `POST /api/auth/logout/` — Logout
- `GET /api/auth/me/` — Get current user info
- `POST /api/auth/generate-otp/<voter_id>/` — Generate OTP for voter

### Elections

- `GET /api/elections/` — List elections
- `POST /api/elections/` — Create election
- `PUT /api/elections/{id}/` — Update election
- `POST /api/elections/{id}/adjust_time/` — Adjust election time
- `GET /api/elections/{id}/results/` — Get election results

### Users

- `GET /api/users/` — List users
- `POST /api/users/` — Create user
- `GET /api/users/{id}/` — Retrieve user

### Voters

- `GET /api/voters/` — List voters
- `POST /api/voters/` — Create voter
- `GET /api/voters/{voter_id}/` — Retrieve voter
- `POST /api/voters/upload-voters/` — Bulk upload voters via Excel

### Portfolios

- `GET /api/portfolios/` — List portfolios
- `POST /api/portfolios/` — Create portfolio
- `PATCH /api/portfolios/{id}/update_level/` — Update level restriction
- `PATCH /api/portfolios/{id}/update_gender/` — Update gender restriction
- `PATCH /api/portfolios/{id}/update_department/` — Update department restriction

### Candidates

- `GET /api/candidates/` — List candidates
- `POST /api/candidates/` — Create candidate

### Voting

- `GET /api/voting/portfolios/?voter_id={id}` — Get eligible portfolios for voter
- `POST /api/voting/cast_vote/` — Cast votes (bulk or single)

### Audit Logs

- `GET /api/logs/` — View activity logs

## User Roles & Permissions

- **Superadmin**: Full system control, manage elections and users
- **Admin**: Manage voters, candidates, portfolios, view results/logs
- **Polling Agent**: Generate OTPs for voters
- **Voter**: Vote using student ID and OTP, view eligible portfolios

## Business Rules

- **Election Lifecycle**: Elections have start/end times, automatic closure
- **Voting Restrictions**: Portfolio eligibility by level, gender, department
- **One Vote Per Portfolio**: Voters can vote once per portfolio
- **OTP Authentication**: Secure voter access via OTP
- **Audit Trail**: All actions logged with IP and timestamp
- **Read-only Mode**: System locks after election ends
- **Bulk Voter Upload**: Admins can upload Excel files with voter data

## Security Features

- Role-based access control
- OTP-based voter authentication
- IP address and session logging
- Anonymous voting (no voter reference in votes)
- Audit trail for all actions

## Database Models

- **Election**: Election configuration and timing
- **User**: System users (superadmin, admin, polling agent)
- **Voter**: Student voters with eligibility info
- **Portfolio**: Voting positions/offices with restrictions
- **Candidate**: Candidates for each portfolio
- **Vote**: Anonymous votes
- **Log**: Activity audit trail

## Development & Testing

- Add models in `*/models.py`
- Create serializers in `*/serializers.py`
- Add views in `*/views.py`
- Update URLs in `*/urls.py`
- Run tests:
  ```bash
  python manage.py test
  ```
- Bulk voter upload requires `openpyxl`:
  ```bash
  pip install openpyxl
  ```

## Example Usage

See `api_usage_accounts.json`, `voting.api.example.usage.json`, example_audit.json, and `election.example.json` for sample requests and responses.

---

**For more details, review the code and documentation in each app directory.**
