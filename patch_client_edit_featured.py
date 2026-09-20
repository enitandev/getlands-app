with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

checkbox_ui = """
            <div className="flex items-center gap-[10px] h-[50px] mt-[20px] md:mt-0">
              <input type="checkbox" id="featured" name="featured" value="true" defaultChecked={initialData.featured} className="w-[20px] h-[20px] accent-[#008b45] cursor-pointer" />
              <label htmlFor="featured" className="text-[13px] font-bold text-ink cursor-pointer">Feature on Dashboard</label>
            </div>
"""

content = content.replace(
    '</select>\n            </div>\n          </div>',
    '</select>\n            </div>\n' + checkbox_ui + '\n          </div>'
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
