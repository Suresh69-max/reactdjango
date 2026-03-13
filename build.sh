#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Node.js dependencies and build frontend
cd frontend
npm install
npm run build
cd ..

# Move built frontend to Django static files and templates
mkdir -p staticfiles
mkdir -p templates
cp -r frontend/dist/* staticfiles/
cp frontend/dist/index.html templates/

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
