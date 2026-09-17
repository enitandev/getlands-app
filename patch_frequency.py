import re

def patch_file(filepath, is_edit=False):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the block for returnsFrequency
    if is_edit:
        old_block = """<div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="returnsFrequency" defaultValue={initialData.returnsFrequency || ""} placeholder="e.g. every 2 months" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>"""
        
        new_block = """<div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <select name="returnsFrequency" defaultValue={initialData.returnsFrequency || ""} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                    <option value="" disabled>Select frequency</option>
                    <option value="every month">Every month</option>
                    <option value="every 2 months">Every 2 months</option>
                    <option value="at maturity">At maturity (full term)</option>
                  </select>
                </div>"""
    else:
        old_block = """<div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="returnsFrequency" placeholder="e.g. every 2 months" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>"""
        
        new_block = """<div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <select name="returnsFrequency" defaultValue="" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                    <option value="" disabled>Select frequency</option>
                    <option value="every month">Every month</option>
                    <option value="every 2 months">Every 2 months</option>
                    <option value="at maturity">At maturity (full term)</option>
                  </select>
                </div>"""

    content = content.replace(old_block, new_block)

    with open(filepath, 'w') as f:
        f.write(content)

patch_file('src/app/admin/marketplace/create/page.tsx', False)
patch_file('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', True)
