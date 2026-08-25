# AthleTech - Admin Dashboard

Admin (Event Organizer) panel for **AthleTech**, a web-based athletic meet management system that automates competitor registration, payment slip verification, real-time performance recording, IAAF-based scoring and result publishing.

This repository contains **only the admin front-end**. The public-facing site and the API live in separate repositories:

| Layer | Repository |
|---|---|
| Admin Dashboard (this repo) | [AthleTech_Admin_Dashboard](https://github.com/Ishari-928/AthleTech_Admin_Dashboard) |
| Client / Public UI | [AthleTech_Client_UI](https://github.com/Ishari-928/AthleTech_Client_UI) |
| REST API & Database layer | [AthleTech_Backend](https://github.com/Ishari-928/AthleTech_Backend) |

---

## Tech Stack

- **React.js** (functional components + hooks)
- **Vite** - dev server and build tool
- **Tailwind CSS** + PostCSS - styling
- **ESLint** - linting
- **JavaScript (ES6+)**
- Communicates with the AthleTech backend over **REST APIs** (JSON / HTTPS), authenticated with **JWT**

---

## What the Admin Panel Does

### User & Role Management
- Admin login with username/password authentication
- Role-based access levels (e.g. Event Manager, Finance Manager)
- View and edit admin profile details

### Event Management
- Create, modify and delete events (event name, age group, max participants)
- Track participant counts per event
- Update event status - *open / closed / finished*
- Manage progression of heats, semifinals and finals

### Competitor & Registration Management
- View all athlete registrations with full details
- Verify registration limits and registration status
- View auto-generated BIB numbers
- Filter registrations by event, age group, school/club or payment status

### Payment Slip Verification
Registration fees are paid offline by bank deposit or transfer. The athlete uploads a scanned slip during registration, and the admin verifies it here.

- View a queue of pending registrations with their uploaded slips
- Open and inspect the slip image/PDF full size
- Approve or reject a slip, with a rejection reason sent back to the athlete
- Registration is confirmed and the BIB number released only after approval
- Mark payment status - *Pending / Verified / Rejected*
- Track pending and verified payments per event
- Generate financial reports (registration income + advertisement revenue)

### Performance & Results
- Record athlete performances (time/distance, position)
- Automated IAAF Point Table scoring
- Publish results in real time
- Generate downloadable result reports (PDF)
- School / club point tracking and championship rankings

### Advertisement Management
- Create advertisements (title, company name, sponsor amount, image/GIF)
- Assign display areas (banner, sidebar, etc.)
- Track sponsor contributions and advertisement performance

### Coach Article Approval
- Review and publish coach/trainer submitted articles

### Notifications
- Trigger registration confirmation and BIB number emails after slip approval
- Notify athletes when a slip is rejected and needs re-upload
- Send bulk announcements for event updates, date changes or cancellations

---

## Project Structure

```
AthleTech_Admin_Dashboard/
├── public/                 # Static assets served as-is
├── src/                    # Application source
│   ├── assets/             # Images, icons, fonts
│   ├── components/         # Reusable UI components
│   ├── pages/              # Admin screens (events, registrations, slip verification, ads, results)
│   ├── services/           # API call helpers (axios/fetch wrappers)
│   ├── App.jsx             # Root component & routing
│   └── main.jsx            # React entry point
├── index.html              # Vite HTML entry
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind theme & content paths
├── postcss.config.js       # PostCSS plugin configuration
├── eslint.config.js        # ESLint rules
├── package.json            # Dependencies and npm scripts
├── package-lock.json       # Locked dependency tree
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- The [AthleTech_Backend](https://github.com/Ishari-928/AthleTech_Backend) API running locally or deployed

### Installation

```bash
git clone https://github.com/Ishari-928/AthleTech_Admin_Dashboard.git
cd AthleTech_Admin_Dashboard
git checkout test-admin
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Vite only exposes variables prefixed with `VITE_` to the client. Never place secret keys here.

### Available Scripts

```bash
npm run dev       # Start the dev server with hot module replacement
npm run build     # Production build into /dist
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

The dev server runs at `http://localhost:5173` by default.

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable release |
| `test-admin` | Active development / testing branch |

---

## Security Notes

- All admin routes are protected - access requires a valid JWT issued by the backend.
- Sessions time out automatically after a period of inactivity.
- Sensitive operations (slip verification, result publishing) are restricted by role.
- Uploaded payment slips contain bank details, so slip URLs are served only to authenticated admins.
- The dashboard must be served over HTTPS in production.

---

## Author

**Abeysooriya I. P**
BSc (Hons) Information Technology & Management
Faculty of Information Technology
University of Moratuwa

Developed for **Individual Project on Business Solutions**.

---

## Contact

For questions about this repository, integration support, or collaboration enquiries:

| | |
|---|---|
| **Email** | [ishariabeysooriya628@gmail.com](mailto:ishariabeysooriya628@gmail.com) |
| **LinkedIn** | [ishari-abeysooriya-628i](https://www.linkedin.com/in/ishari-abeysooriya-628i) |
| **GitHub** | [@Ishari-928](https://github.com/Ishari-928) |

**Bug reports and feature requests** - please open an issue on the relevant repository rather than emailing directly, so the discussion stays with the code:

- Admin panel issues → [AthleTech_Admin_Dashboard/issues](https://github.com/Ishari-928/AthleTech_Admin_Dashboard/issues)
- Public site issues → [AthleTech_Client_UI/issues](https://github.com/Ishari-928/AthleTech_Client_UI/issues)
- API issues → [AthleTech_Backend/issues](https://github.com/Ishari-928/AthleTech_Backend/issues)

### Academic Supervision

- **Ms. B. N. N. T. Batagoda** - Lecturer, Faculty of Information Technology, University of Moratuwa
- **Mr. Chandeepa Pathirana** - Software Engineer, SimCentric Technologies