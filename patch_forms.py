import re

def patch_form(file_path, is_edit=False):
    with open(file_path, 'r') as f:
        content = f.read()

    # Change projectedReturn type="number" to type="text"
    if is_edit:
        old_return = """<label className="block text-[13px] font-bold text-ink mb-[8px]">Target Return Percentage (%) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="projectedReturn" defaultValue={initialData.projectedReturn || ""} step="0.1" placeholder="25" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />"""
        new_return = """<label className="block text-[13px] font-bold text-ink mb-[8px]">Target Return (%) <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="projectedReturn" defaultValue={initialData.projectedReturn || ""} placeholder="e.g. 15%" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />"""
    else:
        old_return = """<label className="block text-[13px] font-bold text-ink mb-[8px]">Target Return Percentage (%) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="projectedReturn" step="0.1" placeholder="25" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />"""
        new_return = """<label className="block text-[13px] font-bold text-ink mb-[8px]">Target Return (%) <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="projectedReturn" placeholder="e.g. 15%" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />"""

    content = content.replace(old_return, new_return)

    # Insert returnsFrequency
    if is_edit:
        returns_freq = """</div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="returnsFrequency" defaultValue={initialData.returnsFrequency || ""} placeholder="e.g. every 2 months" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>"""
    else:
        returns_freq = """</div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="returnsFrequency" placeholder="e.g. every 2 months" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>"""

    # We need to insert this after projectedReturn.
    # We can replace the closing div of projectedReturn block.
    # Wait, projectedReturn block is:
    # <div>
    #   <label...>...</label>
    #   <input... />
    # </div>
    
    # Let's just do a regex replace
    pattern = re.compile(r'(<input type="text" name="projectedReturn"[^>]+>\s*</div>)')
    
    content = pattern.sub(r'\1\n' + returns_freq, content)

    with open(file_path, 'w') as f:
        f.write(content)

patch_form('src/app/admin/marketplace/create/page.tsx', False)
patch_form('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', True)

