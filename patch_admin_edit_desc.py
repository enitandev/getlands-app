import re

description_field_edit = """            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Description</label>
              <textarea name="description" defaultValue={initialData.description || ''} rows={6} className="w-full bg-[#f7f9f7] rounded-[12px] p-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" placeholder="Write a detailed description..."></textarea>
            </div>\n\n"""

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    edit = f.read()

edit = edit.replace(
    """<div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Status <span className="text-[#e53935]">*</span></label>""",
    description_field_edit + """            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Status <span className="text-[#e53935]">*</span></label>"""
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(edit)
