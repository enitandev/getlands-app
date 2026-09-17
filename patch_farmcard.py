with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "targetReturn: string;",
    "targetReturn: string;\n  returnsFrequency?: string;"
)

content = content.replace(
    "targetReturn, price",
    "targetReturn, returnsFrequency, price"
)

old_return_block = """          <strong className="font-manrope text-[39px] tracking-[-0.06em] text-[#a9e7bd] leading-none">{targetReturn}</strong>
          <span className="text-[9px] text-[#85928b] pb-[6px]">target return</span>"""

new_return_block = """          <div>
            <strong className="font-manrope text-[39px] tracking-[-0.06em] text-[#a9e7bd] leading-none">{targetReturn}</strong>
            {returnsFrequency && <span className="block text-[#a9e7bd] text-[11px] mt-[2px]">{returnsFrequency}</span>}
          </div>
          <span className="text-[9px] text-[#85928b] pb-[6px]">target return</span>"""

content = content.replace(old_return_block, new_return_block)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)
