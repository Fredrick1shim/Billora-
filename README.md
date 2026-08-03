========================================================
                 BILL MANAGEMENT APP
          Flask + SQLite | Windows EXE Version
========================================================

DESCRIPTION:
-------------
A desktop application for creating, storing, and viewing bills.
Packaged as a Windows .exe using PyInstaller. No Python required
on the target machine. SQLite database stores all bills.

--------------------------------------------------------
FOLDER STRUCTURE
--------------------------------------------------------
bill_project/
│
├── README.md             # <-- This file
├── app/                  # Flask backend package
│   ├── __init__.py       # Initializes Flask app
│   └── app.py            # Main server & routes
├── bills.db              # SQLite database
├── requirements.txt      # Dependencies (dev only)
├── templates/            # HTML templates
│   ├── mainpage.html
│   └── the_project.html
└── static/               # CSS, JS, Images
    ├── css/
    │   └── style.css
    ├── js/
        └── script.js


--------------------------------------------------------
DEVELOPER SETUP (Optional)
--------------------------------------------------------
# Create virtual environment (Linux/Mac)
$ python -m venv venv
$ source venv/bin/activate

# Create virtual environment (Windows)
> python -m venv venv
> venv\Scripts\activate

# Install dependencies
$ pip install -r requirements.txt

# Run app locally
$ python app/app.py
# Open http://127.0.0.1:5000 in browser

--------------------------------------------------------
BUILD WINDOWS EXE
--------------------------------------------------------
# Install PyInstaller
$ pip install pyinstaller

# Build exe (from project root)
$ pyinstaller --onefile --add-data "templates;templates" --add-data "static;static" app/app.py

# The exe will be in 'dist/' folder
# Place 'bills.db' next to the exe

--------------------------------------------------------
RUNNING THE EXE
--------------------------------------------------------
# Simply double-click the exe
# The Flask server will start automatically
# Dashboard opens in default browser

--------------------------------------------------------
NOTES
--------------------------------------------------------
* Database path is relative: bills.db must be next to exe
* Static files (CSS, JS, images) are bundled in the exe
* Virtual environment is NOT needed for running the exe
* All terminal commands are for development/building only
========================================================
