import re
with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# Add new states
old_states = """  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');"""
new_states = """  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  
  // Custom Bank Dropdown States
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');"""
content = content.replace(old_states, new_states)

# Replace the Bank Name select box
old_select = """              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <input type="hidden" name="bankName" value={selectedBankName} />
                <select 
                  value={selectedBankCode}
                  onChange={(e) => {
                    setSelectedBankCode(e.target.value);
                    const b = banks.find(b => b.code === e.target.value);
                    if(b) setSelectedBankName(b.name);
                  }}
                  className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" 
                  required
                >
                  <option value="" disabled>Select bank</option>
                  {banks.map((b: any) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
              </div>"""

new_select = """              <div className="relative">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <input type="hidden" name="bankName" value={selectedBankName} required />
                
                {/* Fake Select Button */}
                <button 
                  type="button"
                  onClick={() => setIsBankDropdownOpen(true)}
                  className={`w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border transition-colors shadow-sm flex items-center justify-between text-left ${selectedBankName ? 'text-ink' : 'text-gray-400'} border-gray-300 hover:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20`}
                >
                  <span className="truncate">{selectedBankName || 'Search for a bank...'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>

                {/* Dropdown Modal/Popover */}
                {isBankDropdownOpen && (
                  <>
                    {/* Invisible overlay to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsBankDropdownOpen(false)}></div>
                    
                    <div className="absolute top-full left-0 right-0 mt-[5px] bg-white border border-gray-200 rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden flex flex-col max-h-[300px]">
                      <div className="p-[10px] border-b border-gray-100 bg-gray-50 sticky top-0">
                        <div className="relative">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <input 
                            type="text" 
                            autoFocus
                            placeholder="Type to search..." 
                            value={bankSearchTerm}
                            onChange={(e) => setBankSearchTerm(e.target.value)}
                            className="w-full h-[40px] pl-[35px] pr-[15px] bg-white border border-gray-200 rounded-[8px] outline-none text-[13px] focus:border-[#008b45]"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto scrollbar-hide flex-1 p-[5px]">
                        {banks.filter(b => b.name.toLowerCase().includes(bankSearchTerm.toLowerCase())).length === 0 ? (
                          <div className="p-[15px] text-center text-[13px] text-gray-500">No banks found matching "{bankSearchTerm}"</div>
                        ) : (
                          banks.filter(b => b.name.toLowerCase().includes(bankSearchTerm.toLowerCase())).map((b: any) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => {
                                setSelectedBankCode(b.code);
                                setSelectedBankName(b.name);
                                setIsBankDropdownOpen(false);
                                setBankSearchTerm('');
                              }}
                              className={`w-full text-left px-[15px] py-[12px] rounded-[8px] text-[13px] transition-colors ${selectedBankCode === b.code ? 'bg-[#eef3ef] text-[#008b45] font-bold' : 'hover:bg-gray-50 text-ink'}`}
                            >
                              {b.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>"""

content = content.replace(old_select, new_select)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)
