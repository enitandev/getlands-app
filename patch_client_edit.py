import re

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

# Add imports for cohort actions
content = content.replace(
    'import React from \'react\';',
    'import React, { useState } from \'react\';\nimport { createCohort, updateCohortStatus } from \'@/app/actions/cohorts\';'
)

# Render cohorts UI before the final closing div
cohorts_ui = """
      <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm mt-[40px]">
        <div className="flex justify-between items-center mb-[20px]">
          <h2 className="font-manrope text-[18px] font-bold">4. Opportunity Cohorts</h2>
          <button type="button" onClick={() => setIsAddingCohort(!isAddingCohort)} className="px-[16px] py-[8px] bg-[#008b45] text-white text-[12px] font-bold rounded-full">
            {isAddingCohort ? 'Cancel' : '+ New Cohort'}
          </button>
        </div>
        
        {isAddingCohort && (
          <div className="bg-[#f7f9f7] p-[20px] rounded-[16px] mb-[20px] border border-black/5">
            <h3 className="font-bold text-[14px] mb-[15px]">Create Funding Cohort</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
              <input type="text" id="cohortName" placeholder="e.g. Batch 05" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              <input type="number" id="cohortCapacity" placeholder="Capacity Amount (₦)" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              <select id="cohortStatus" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]">
                <option value="COMING_SOON">Coming Soon</option>
                <option value="PRE_ORDER">Pre-order</option>
                <option value="OPEN">Open</option>
              </select>
              <input type="datetime-local" id="cohortPreorder" title="Pre-order Opens At" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              <input type="datetime-local" id="cohortPublic" title="Public Opens At" className="h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              <button type="button" onClick={handleCreateCohort} className="h-[45px] bg-[#102218] text-white font-bold rounded-[10px]">Save Cohort</button>
            </div>
          </div>
        )}

        <div className="space-y-[15px]">
          {initialData.cohorts?.map((c: any) => (
            <div key={c.id} className="p-[20px] border border-black/5 rounded-[16px] flex justify-between items-center">
              <div>
                <strong className="block text-[15px]">{c.name} <span className="text-[#68736d] text-[12px] ml-[10px]">#{c.cohortCode}</span></strong>
                <div className="text-[12px] text-[#68736d] mt-[5px]">
                  Capacity: ₦{c.capacityAmount.toLocaleString()} | Available: ₦{c.availableAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <select 
                  defaultValue={c.status}
                  onChange={(e) => updateCohortStatus(c.id, e.target.value)}
                  className={`h-[36px] px-[15px] rounded-full text-[11px] font-bold uppercase tracking-[0.05em] outline-none border border-black/10
                    ${c.status === 'OPEN' || c.status === 'ACTIVE' ? 'bg-[#eef3ef] text-[#008b45]' : 
                      c.status === 'PRE_ORDER' ? 'bg-[#fff8eb] text-[#f5a623]' : 'bg-[#f7f9f7] text-[#68736d]'}`}
                >
                  <option value="COMING_SOON">Coming Soon</option>
                  <option value="PRE_ORDER">Pre-Order</option>
                  <option value="OPEN">Open</option>
                  <option value="FULL">Full</option>
                  <option value="ACTIVE">Active</option>
                  <option value="MATURING">Maturing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          ))}
          {!initialData.cohorts?.length && (
            <p className="text-[13px] text-[#68736d]">No cohorts defined yet. The opportunity will act as a static product.</p>
          )}
        </div>
      </div>
"""

# Insert state for the form
content = content.replace(
    'export default function ClientEditOpportunity({ initialData }: { initialData: any }) {',
    'export default function ClientEditOpportunity({ initialData }: { initialData: any }) {\n  const [isAddingCohort, setIsAddingCohort] = useState(false);\n\n  const handleCreateCohort = async () => {\n    const name = (document.getElementById("cohortName") as HTMLInputElement).value;\n    const capacityAmount = (document.getElementById("cohortCapacity") as HTMLInputElement).value;\n    const status = (document.getElementById("cohortStatus") as HTMLSelectElement).value;\n    const preorder = (document.getElementById("cohortPreorder") as HTMLInputElement).value;\n    const pub = (document.getElementById("cohortPublic") as HTMLInputElement).value;\n    \n    if (!name) return alert("Name is required");\n\n    const fd = new FormData();\n    fd.append("opportunityId", initialData.id);\n    fd.append("name", name);\n    fd.append("capacityAmount", capacityAmount);\n    fd.append("status", status);\n    fd.append("preorderOpensAt", preorder);\n    fd.append("publicOpensAt", pub);\n\n    await createCohort(fd);\n    setIsAddingCohort(false);\n  };\n'
)

# Insert the UI right before the final form submit buttons
content = content.replace(
    '<div className="flex justify-end gap-[15px]">',
    cohorts_ui + '\n        <div className="flex justify-end gap-[15px]">'
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)

