"use client";
import { createCohort, updateCohortStatus } from '@/app/actions/cohorts';
import React, { useState } from 'react';
import Link from 'next/link';
import { editOpportunity } from '@/app/actions/admin';

export default function ClientEditOpportunity({ initialData }: { initialData: any }) {
  const [isAddingCohort, setIsAddingCohort] = useState(false);

  const handleCreateCohort = async () => {
    const name = (document.getElementById("cohortName") as HTMLInputElement).value;
    const capacityAmount = (document.getElementById("cohortCapacity") as HTMLInputElement).value;
    const status = (document.getElementById("cohortStatus") as HTMLSelectElement).value;
    const preorder = (document.getElementById("cohortPreorder") as HTMLInputElement).value;
    const pub = (document.getElementById("cohortPublic") as HTMLInputElement).value;
    
    if (!name) return alert("Name is required");

    const fd = new FormData();
    fd.append("opportunityId", initialData.id);
    fd.append("name", name);
    fd.append("capacityAmount", capacityAmount);
    fd.append("status", status);
    fd.append("preorderOpensAt", preorder);
    fd.append("publicOpensAt", pub);

    await createCohort(fd);
    setIsAddingCohort(false);
  };

  const [category, setCategory] = useState<'land' | 'farm' | 'land_banking'>(initialData.category || 'land');

  return (
    <div className="max-w-[800px] mx-auto space-y-[40px]">
      <div className="flex items-center gap-[15px]">
        <Link href="/admin/marketplace" className="w-[40px] h-[40px] bg-white border border-black/10 rounded-full flex items-center justify-center text-ink hover:bg-[#f7f9f7] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </Link>
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Update Opportunity</h1>
          <p className="text-[13px] text-[#68736d]">Configure a new asset for the marketplace.</p>
        </div>
      </div>

      <form className="space-y-[30px]" action={editOpportunity.bind(null, initialData.id)}>
        <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm">
          <h2 className="font-manrope text-[18px] font-bold mb-[20px]">1. Select Asset Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
            {[
              { id: 'land', label: 'Land', desc: 'Outright land purchase' },
              { id: 'farm', label: 'Farm Cycle', desc: 'Fractional agricultural investment' },
              { id: 'land_banking', label: 'Land Banking', desc: 'Fixed-term structured returns' }
            ].map((c) => (
              <label 
                key={c.id}
                className={`relative flex flex-col p-[20px] rounded-[16px] border-[2px] cursor-pointer transition-all ${category === c.id ? 'border-[#008b45] bg-[#008b45]/5' : 'border-black/5 hover:border-black/10'}`}
              >
                <input 
                  type="radio" 
                  name="category"  
                  value={c.id} 
                  checked={category === c.id} 
                  onChange={() => setCategory(c.id as any)}
                  className="sr-only" 
                />
                <span className={`font-bold mb-[5px] ${category === c.id ? 'text-[#008b45]' : 'text-ink'}`}>{c.label}</span>
                <span className="text-[12px] text-[#68736d]">{c.desc}</span>
                {category === c.id && (
                  <div className="absolute top-[20px] right-[20px] w-[20px] h-[20px] bg-[#008b45] rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm space-y-[20px] animate-fade-in">
          <h2 className="font-manrope text-[18px] font-bold mb-[20px]">2. Basic Details</h2>
          
                      <div className="mb-[20px]">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Cover Image URL <span className="text-[#e53935]">*</span></label>
              <input type="file" accept="image/*" name="coverImage" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              <p className="text-[11px] text-[#68736d] mt-[5px]">Leave empty to keep existing image</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Title <span className="text-[#e53935]">*</span></label>
              <input type="text" name="title" defaultValue={initialData.title || ""} placeholder="e.g. 60x120 Plot in Abeokuta" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Location / City <span className="text-[#e53935]">*</span></label>
              <input type="text" name="location" defaultValue={initialData.location || ""} placeholder="e.g. Abeokuta" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">State <span className="text-[#e53935]">*</span></label>
              <select name="state" defaultValue={initialData.state || ""} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                <option value="">Select State</option>
                <option value="Ogun">Ogun State</option>
                <option value="Lagos">Lagos State</option>
                <option value="Kaduna">Kaduna State</option>
              </select>
            </div>

                        <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Description</label>
              <textarea name="description" defaultValue={initialData.description || ''} rows={6} className="w-full bg-[#f7f9f7] rounded-[12px] p-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" placeholder="Write a detailed description..."></textarea>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Status <span className="text-[#e53935]">*</span></label>
              <select name="status" defaultValue={initialData.status || ""} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                <option value="available">Available</option>
                <option value="sold_out">Sold Out</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm space-y-[20px] animate-fade-in">
          <h2 className="font-manrope text-[18px] font-bold mb-[20px]">3. Financial Structure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {category === 'land' && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Price (₦) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="price" defaultValue={initialData.price || ""} placeholder="500000" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Size</label>
                  <input type="text" name="landSize" defaultValue={initialData.landSize || ""} placeholder="e.g. 60 x 120 ft" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Title Document</label>
                  <input type="text" name="documentationStatus" defaultValue={initialData.documentationStatus || ""} placeholder="e.g. C of O, Registered Survey" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                </div>
              </>
            )}

            {category === 'farm' && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Price Per Slot (₦) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="slotPrice" defaultValue={initialData.slotPrice || ""} placeholder="100000" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Target Return (%) <span className="text-[#e53935]">*</span></label>
                  <input type="text" name="projectedReturn" defaultValue={initialData.projectedReturn || ""} placeholder="e.g. 15%" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Returns Frequency <span className="text-[#e53935]">*</span></label>
                  <select name="returnsFrequency" defaultValue={initialData.returnsFrequency || ""} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                    <option value="" disabled>Select frequency</option>
                    <option value="every month">Every month</option>
                    <option value="every 2 months">Every 2 months</option>
                    <option value="at maturity">At maturity (full term)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Cycle Duration (Months) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="duration" defaultValue={initialData.duration || ""} placeholder="6" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
              </>
            )}

            {category === 'land_banking' && (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Acquisition Price (₦) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="acquisitionPrice" defaultValue={initialData.acquisitionPrice || ""} placeholder="1000000" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Holding Period (Months) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="duration" defaultValue={initialData.duration || ""} placeholder="12" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Stated Exit Value (₦) <span className="text-[#e53935]">*</span></label>
                  <input type="number" name="statedExitValue" defaultValue={initialData.statedExitValue || ""} placeholder="1400000" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
                </div>
              </>
            )}
          </div>
        </div>
        
        
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

        <div className="flex justify-end gap-[15px]">
          <Link href="/admin/marketplace" className="px-[24px] py-[14px] bg-white border border-black/10 rounded-full text-ink font-bold hover:bg-[#f7f9f7] transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-[32px] py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
            Publish Opportunity
          </button>
        </div>
      </form>
    </div>
  );
}
