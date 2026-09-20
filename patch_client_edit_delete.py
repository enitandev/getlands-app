import re

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { createCohort, updateCohortStatus } from '@/app/actions/cohorts';",
    "import { createCohort, updateCohortStatus, deleteCohort } from '@/app/actions/cohorts';"
)

delete_button_ui = """
              <div className="flex items-center gap-[10px]">
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
                <button type="button" onClick={async () => { if(window.confirm('Delete this cohort?')) { await deleteCohort(c.id); window.location.reload(); } }} className="text-[#e53935] hover:bg-[#e53935]/10 p-[8px] rounded-full transition-colors" title="Delete Cohort">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
"""

content = re.sub(
    r'<div>\s*<select[\s\S]*?</select>\s*</div>',
    delete_button_ui,
    content
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
