import os
import shutil
import re

src_dir = os.path.dirname(os.path.abspath(__file__))

dirs_to_create = [
    'components/rider',
    'components/driver',
    'components/auth',
    'components/shared/layout',
    'components/shared/ui',
    'pages/public',
    'pages/shared',
    'pages/rider',
    'pages/driver',
    'constants',
]

for d in dirs_to_create:
    try:
        os.makedirs(os.path.join(src_dir, d), exist_ok=True)
    except OSError:
        pass

moves = [
    ('constant/vehicleImages.js', 'constants/vehicleImages.js'),
    ('components/RideSearch.jsx', 'components/rider/RideSearch.jsx'),
    ('components/NearDriver.jsx', 'components/rider/NearDriver.jsx'),
    ('components/layout/Footer.jsx', 'components/shared/layout/Footer.jsx'),
    ('components/layout/Hero.jsx', 'components/shared/layout/Hero.jsx'),
    ('components/layout/Navbar.jsx', 'components/shared/layout/Navbar.jsx'),
    ('components/ui/LocationInput.jsx', 'components/shared/ui/LocationInput.jsx'),
    ('components/LandingPage.jsx', 'pages/public/LandingPage.jsx'),
    ('pages/Payment.jsx', 'pages/shared/Payment.jsx'),
    ('utils/vehicle.js', 'utils/vehicleHelpers.js'),
]

for src, dst in moves:
    src_path = os.path.join(src_dir, src)
    dst_path = os.path.join(src_dir, dst)
    if os.path.exists(src_path):
        os.makedirs(os.path.dirname(dst_path), exist_ok=True)
        shutil.move(src_path, dst_path)
        print(f"Moved {src} to {dst}")
    else:
        print(f"Could not find {src}")

# Clean up empty dirs
for d in ['components/layout', 'components/ui', 'constant']:
    d_path = os.path.join(src_dir, d)
    if os.path.exists(d_path) and not os.listdir(d_path):
        os.rmdir(d_path)

replacements = {
    "from '../constant/vehicleImages'": "from '../../constants/vehicleImages'",
    "from '../utils/vehicle'": "from '../../utils/vehicleHelpers'",
    
    "from './ui/LocationInput'": "from '../shared/ui/LocationInput'",
    "from './layout/Navbar'": "from '../shared/layout/Navbar'",
    "from './layout/Hero'": "from '../shared/layout/Hero'",
    "from './layout/Footer'": "from '../shared/layout/Footer'",
    
    "from '../components/RideSearch'": "from '../components/rider/RideSearch'",
    "from '../components/LandingPage'": "from '../pages/public/LandingPage'",
    "from './components/LandingPage'": "from './pages/public/LandingPage'",
    "from './components/RideSearch'": "from './components/rider/RideSearch'",
    
    "from '../hooks/rider'": "from '../../hooks/rider'",
}

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx') or f.endswith('.js'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            orig_content = content
            for old, new in replacements.items():
                content = content.replace(old, new)
            
            if orig_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Updated imports in {f}")

print("Restructure complete!")
