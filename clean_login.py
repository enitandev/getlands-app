with open('src/app/login/page.tsx', 'r') as f:
    content = f.read()

demo_block = """            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-xs mb-4">
              <strong>Demo Accounts:</strong><br />
              Admin: admin@getlands.com<br />
              Customer: emeka@example.com<br />
              Password: anything
            </div>"""

content = content.replace(demo_block, "")

with open('src/app/login/page.tsx', 'w') as f:
    f.write(content)
