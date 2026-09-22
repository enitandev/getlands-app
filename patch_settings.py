import re

with open('src/app/actions/admin-ops.ts', 'r') as f:
    content = f.read()

pattern = r"(processingFee: parseFloat\(formData\.get\('processingFee'\) as string \|\| '0'\),\n\s*agentCommission: parseFloat\(formData\.get\('agentCommission'\) as string \|\| '0'\))"
replacement = r"\1,\n      referralBonusPercentage: parseFloat(formData.get('referralBonusPercentage') as string || '0')"

content = re.sub(pattern, replacement, content)

with open('src/app/actions/admin-ops.ts', 'w') as f:
    f.write(content)

with open('src/app/admin/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# Add a Referral Settings box under General tab
general_pattern = r"(<div className=\"text-\[14px\] font-bold text-ink mb-\[5px\]\">Agent Commission \(\%\)</div>\n\s*<input type=\"number\" name=\"agentCommission\" defaultValue=\{initialSettings\.agentCommission\} step=\"0\.1\" className=\"w-full bg-\[\#f7f9f7\] border border-black/5 rounded-\[12px\] p-\[12px_16px\] outline-none focus:border-\[\#008b45\] transition-colors text-\[15px\]\" />\n\s*</div>\n\s*</div>)"

referral_box = """

            <hr className="border-black/5 my-[30px]" />
            <h3 className="font-manrope text-[18px] font-bold text-ink mb-[20px]">Referral Program</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <div className="text-[14px] font-bold text-ink mb-[5px]">Customer Referral Bonus (%)</div>
                <input type="number" name="referralBonusPercentage" defaultValue={initialSettings.referralBonusPercentage || 10} step="0.1" className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] p-[12px_16px] outline-none focus:border-[#008b45] transition-colors text-[15px]" />
                <p className="text-[12px] text-[#7a847f] mt-[5px]">Percentage of a referred user's first investment paid to the referrer.</p>
              </div>
            </div>"""

content = re.sub(general_pattern, r"\1" + referral_box, content)

with open('src/app/admin/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)

