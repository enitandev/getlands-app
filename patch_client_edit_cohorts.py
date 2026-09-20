import re

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'r') as f:
    content = f.read()

# I need to add state for editing cohort and custom confirm modal
state_additions = """
  const [isAddingCohort, setIsAddingCohort] = useState(false);
  const [editingCohortId, setEditingCohortId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const openEditForm = (c: any) => {
    setIsAddingCohort(true);
    setEditingCohortId(c.id);
    setTimeout(() => {
      (document.getElementById("cohortName") as HTMLInputElement).value = c.name || '';
      (document.getElementById("cohortCapacity") as HTMLInputElement).value = c.capacityAmount?.toString() || '';
      (document.getElementById("cohortStatus") as HTMLSelectElement).value = c.status || 'OPEN';
      (document.getElementById("cohortPreorder") as HTMLInputElement).value = c.preorderOpensAt ? new Date(c.preorderOpensAt).toISOString().slice(0, 16) : '';
      (document.getElementById("cohortPublic") as HTMLInputElement).value = c.publicOpensAt ? new Date(c.publicOpensAt).toISOString().slice(0, 16) : '';
      (document.getElementById("cohortCloses") as HTMLInputElement).value = c.closesAt ? new Date(c.closesAt).toISOString().slice(0, 16) : '';
    }, 100);
  };
"""

content = re.sub(
    r'const \[isAddingCohort, setIsAddingCohort\] = useState\(false\);',
    state_additions.strip(),
    content
)

# Update handleCreateCohort to handle EDIT
handle_create = """
  const handleCreateCohort = async () => {
    const name = (document.getElementById("cohortName") as HTMLInputElement).value;
    const capacityAmount = (document.getElementById("cohortCapacity") as HTMLInputElement).value;
    const status = (document.getElementById("cohortStatus") as HTMLSelectElement).value;
    const preorder = (document.getElementById("cohortPreorder") as HTMLInputElement).value;
    const pub = (document.getElementById("cohortPublic") as HTMLInputElement).value;
    const closes = (document.getElementById("cohortCloses") as HTMLInputElement).value;
    
    if (!name) return alert("Name is required");

    const fd = new FormData();
    fd.append("opportunityId", initialData.id);
    fd.append("name", name);
    fd.append("capacityAmount", capacityAmount);
    fd.append("status", status);
    fd.append("preorderOpensAt", preorder);
    fd.append("publicOpensAt", pub);
    fd.append("closesAt", closes);
    
    if (editingCohortId) {
      fd.append("cohortId", editingCohortId);
      await createCohort(fd); // We'll modify createCohort to handle upsert
    } else {
      await createCohort(fd);
    }
    
    setIsAddingCohort(false);
    setEditingCohortId(null);
  };
"""

content = re.sub(
    r'const handleCreateCohort = async \(\) => \{[\s\S]*?setIsAddingCohort\(false\);\n  \};',
    handle_create.strip(),
    content
)

# Replace the form UI to include labels
form_ui = """
        {isAddingCohort && (
          <div className="bg-[#f7f9f7] p-[20px] rounded-[16px] mb-[20px] border border-black/5">
            <h3 className="font-bold text-[14px] mb-[15px]">{editingCohortId ? 'Edit Funding Cohort' : 'Create Funding Cohort'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Cohort Name</label>
                <input type="text" id="cohortName" placeholder="e.g. Batch 05" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Capacity (₦)</label>
                <input type="number" id="cohortCapacity" placeholder="Capacity Amount (₦)" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Status</label>
                <select id="cohortStatus" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]">
                  <option value="COMING_SOON">Coming Soon</option>
                  <option value="PRE_ORDER">Pre-order</option>
                  <option value="OPEN">Open</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Pre-order Opens</label>
                <input type="datetime-local" id="cohortPreorder" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Public Opens</label>
                <input type="datetime-local" id="cohortPublic" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink mb-[5px] uppercase tracking-wider">Cohort Closes</label>
                <input type="datetime-local" id="cohortCloses" className="w-full h-[45px] px-[15px] rounded-[10px] border border-black/10 outline-none focus:border-[#008b45]" />
              </div>
            </div>
            <div className="flex justify-end mt-[15px]">
              <button type="button" onClick={handleCreateCohort} className="h-[45px] px-[20px] bg-[#102218] text-white font-bold rounded-[10px]">
                {editingCohortId ? 'Update Cohort' : 'Save Cohort'}
              </button>
            </div>
          </div>
        )}
"""

content = re.sub(
    r'\{isAddingCohort && \([\s\S]*?\}\)',
    form_ui.strip(),
    content
)

# Add edit button and custom delete modal to the cohort list
list_ui = """
              <div className="flex items-center gap-[10px] relative">
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
                
                <button type="button" onClick={() => openEditForm(c)} className="text-[#68736d] hover:bg-black/5 p-[8px] rounded-full transition-colors" title="Edit Cohort">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>

                <button type="button" onClick={() => setShowDeleteConfirm(c.id)} className="text-[#e53935] hover:bg-[#e53935]/10 p-[8px] rounded-full transition-colors" title="Delete Cohort">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>

                {showDeleteConfirm === c.id && (
                  <div className="absolute right-0 top-full mt-[10px] bg-white border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-[12px] p-[15px] z-50 w-[250px]">
                    <p className="text-[13px] font-bold mb-[10px] leading-tight">Are you sure you want to delete {c.name}?</p>
                    <div className="flex gap-[10px]">
                      <button type="button" onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-[8px] bg-[#f7f9f7] rounded-[8px] text-[12px] font-bold">Cancel</button>
                      <button type="button" onClick={async () => { await deleteCohort(c.id); setShowDeleteConfirm(null); window.location.reload(); }} className="flex-1 py-[8px] bg-[#e53935] text-white rounded-[8px] text-[12px] font-bold">Delete</button>
                    </div>
                  </div>
                )}
              </div>
"""

content = re.sub(
    r'<div className="flex items-center gap-\[10px\]">[\s\S]*?</button>\s*</div>',
    list_ui.strip(),
    content
)

with open('src/app/admin/marketplace/edit/[slug]/ClientEditOpportunity.tsx', 'w') as f:
    f.write(content)
