"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { editOpportunity } from '@/app/actions/admin';

export default function ClientEditOpportunity({ initialData }: { initialData: any }) {
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
