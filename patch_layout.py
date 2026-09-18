with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

if "ToastContainer" not in content:
    content = content.replace(
        "import './globals.css';",
        "import './globals.css';\nimport { ToastContainer } from '@/components/ui/Toast';"
    )
    content = content.replace(
        "{children}",
        "<ToastContainer />\n        {children}"
    )

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)
