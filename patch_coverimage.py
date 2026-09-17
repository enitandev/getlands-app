def add_cover(filepath, is_edit=False):
    with open(filepath, 'r') as f:
        content = f.read()

    target = '<div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">'
    
    if is_edit:
        new_content = """            <div className="mb-[20px]">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Cover Image URL <span className="text-[#e53935]">*</span></label>
              <input type="url" name="coverImage" defaultValue={initialData.coverImage || ""} placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">"""
    else:
        new_content = """            <div className="mb-[20px]">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Cover Image URL <span className="text-[#e53935]">*</span></label>
              <input type="url" name="coverImage" placeholder="https://images.unsplash.com/..." className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">"""
            
    content = content.replace(target, new_content, 1)

    with open(filepath, 'w') as f:
        f.write(content)

add_cover('src/app/admin/marketplace/create/page.tsx', False)
add_cover('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', True)
