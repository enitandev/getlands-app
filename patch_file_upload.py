with open('src/app/admin/marketplace/create/page.tsx', 'r') as f:
    content = f.read()

import re

# Replace URL input with File input in create
old_input = '<input type="url" name="coverImage" placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />'
new_input = '<input type="file" accept="image/*" name="coverImage" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />'

content = content.replace(old_input, new_input)
with open('src/app/admin/marketplace/create/page.tsx', 'w') as f:
    f.write(content)

# Replace URL input with File input in edit
with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    edit_content = f.read()

old_edit_input = '<input type="url" name="coverImage" defaultValue={initialData.coverImage || ""} placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />'
new_edit_input = '<input type="file" accept="image/*" name="coverImage" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />\n              <p className="text-[11px] text-[#68736d] mt-[5px]">Leave empty to keep existing image</p>'

edit_content = edit_content.replace(old_edit_input, new_edit_input)
with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(edit_content)
