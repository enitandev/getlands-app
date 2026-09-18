with open('src/app/admin/marketplace/edit/[slug]/page.tsx', 'r') as f:
    edit_content = f.read()

description_field_edit = """          <div>
            <label className="block text-[13px] font-bold text-ink mb-[8px]">Description</label>
            <textarea name="description" defaultValue={opp.description || ''} rows={6} className="w-full bg-[#f7f9f7] rounded-[12px] p-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" placeholder="Write a detailed description..."></textarea>
          </div>\n\n"""

edit_content = edit_content.replace(
    '<div>\n            <label className="block text-[13px] font-bold text-ink mb-[8px]">Status</label>',
    description_field_edit + '          <div>\n            <label className="block text-[13px] font-bold text-ink mb-[8px]">Status</label>'
)

with open('src/app/admin/marketplace/edit/[slug]/page.tsx', 'w') as f:
    f.write(edit_content)
