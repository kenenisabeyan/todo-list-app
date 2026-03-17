# 📋Accessible Task Manager/Todo-List

A modern, fully accessible **Task Management Web Application** built using **HTML, CSS, and Vanilla JavaScript**.  
This app allows users to efficiently manage tasks with features like time tracking, categories, priorities, and completion status — all stored locally in the browser using `localStorage`.

---

## 📸 Preview

<img width="937" height="981" alt="image" src="https://github.com/user-attachments/assets/e5763805-730b-41eb-824c-12318020a76d" />

---

## ✨ Features

### 📝 Task Management
- Add tasks with:
  - Name
  - Start & End time
  - Category (Study / Work / Personal)
  - Priority (High / Medium / Low)
- Edit any task field
- Mark tasks as completed (with strikethrough)
- Delete tasks permanently

### 🔍 Productivity Tools
- 🔎 Real-time search/filter by task name  
- 📊 Progress bar showing completion percentage  
- 🌙 Dark mode toggle (saved in `localStorage`)  
- 💾 Persistent storage (tasks remain after refresh)  

### 🎯 User Experience
- ⚡ Instant UI updates  
- 🎨 Clean, modern responsive design  
- 📱 Works on mobile, tablet, and desktop  

### ♿ Accessibility (WCAG Friendly)
- Semantic HTML (`<header>`, `<main>`, `<table>`, etc.)  
- ARIA attributes (`aria-label`, `aria-live`, `role="progressbar"`)  
- Full keyboard navigation support  
- Screen reader announcements for actions  
- High contrast UI (light & dark mode)  
- Visible focus indicators  

---

## 🛠️ Technologies Used

- **HTML5** – Semantic structure  
- **CSS3** – Flexbox, Grid, animations, custom properties  
- **Vanilla JavaScript (ES6)** – Core logic  
- **localStorage** – Data persistence  
- **Font Awesome** – Icons  
- **Google Fonts (Inter)** – Typography  

> ⚡ No frameworks or libraries used (pure JavaScript)

---

## 📂 Project Structure

todo-list-app/
│
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── script.js           # Application logic
├── screenshot.png      # App preview image (optional)
└── README.md           # Project documentation



---

## ⚙️ Getting Started

### 🌐 Run Locall
Simply open `index.html` in any modern browser.

### 💻 Installation

```bash
git clone https://github.com/yourusername/todo-list-app.git
cd todo-list-app

Then open:
index.html
No build tools or server required.

📖 How to Use
➕ Add Task

Enter task name, time, category, and priority

Click Add or press Enter

✏️ Edit Task

Click the ✎ (edit icon)

Modify fields

Click Update or Cancel

✅ Complete Task

Click the checkbox

Task will be marked with strikethrough

🗑️ Delete Task

Click the 🗑️ (trash icon)

Task will be permanently removed

🔍 Search

Type in the search box

Tasks filter instantly

🌙 Dark Mode

Toggle dark/light mode

Preference is saved automatically

📊 Progress Tracking

The progress bar dynamically updates based on completed tasks:

✔ Completed tasks increase progress

📈 Helps track productivity visually

🔮 Future Improvements

📅 Task scheduling & reminders

🔔 Notifications

🧠 AI-based task suggestions

📤 Export tasks (PDF/CSV)

👥 Multi-user support (backend integration)

🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to:

Fork the project

Open an issue

Submit a pull request

👨‍💻 Author

Kenenisa Beyan
Full Stack Developer

🌐 GitHub: https://github.com/kenenisabeyan

⭐ Support

If you found this project helpful:

⭐ Star this repository

🔗 Share it with others

💡 Suggest improvements

📄 License

This project is licensed under the MIT License.

🙌 Acknowledgment

This project was developed as part of continuous learning in web development, focusing on accessibility, clean UI/UX design, and real-world application building.
