for filepath in ['src/app/admin/marketplace/create/page.tsx', 'src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx']:
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("                </div>\n</div>\n                <div className=\"md:col-span-2\">", "                </div>\n                <div className=\"md:col-span-2\">")
    
    with open(filepath, 'w') as f:
        f.write(content)
