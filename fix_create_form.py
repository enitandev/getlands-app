with open('src/app/admin/marketplace/create/page.tsx', 'r') as f:
    content = f.read()

image_input = """            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Cover Image URL <span className="text-[#e53935]">*</span></label>
              <input type="url" name="coverImage" placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div className="grid grid-cols-2 gap-[20px]">"""

content = content.replace('<div className="grid grid-cols-2 gap-[20px]">', image_input, 1)

with open('src/app/admin/marketplace/create/page.tsx', 'w') as f:
    f.write(content)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    edit_content = f.read()

edit_image_input = """            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Cover Image URL <span className="text-[#e53935]">*</span></label>
              <input type="url" name="coverImage" defaultValue={initialData.coverImage || ''} placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div className="grid grid-cols-2 gap-[20px]">"""

edit_content = edit_content.replace('<div className="grid grid-cols-2 gap-[20px]">', edit_image_input, 1)

# Also ensure ClientEditOpportunity renders the dynamic fields properly. I remember I didn't finish Edit either! Let's check Edit content.
with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(edit_content)

