import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Farms
old_farm = """<div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-[15px]">
                      <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider">FARM · {opp.location.toUpperCase()}</div>
                      {owned && (
                        <div className="bg-[#eef3ef] text-[#008b45] text-[10px] font-bold px-[8px] py-[4px] rounded-[6px] text-center leading-tight">
                          You own<br/>{formatCurrency(owned.totalAmount).replace('.00', '')}
                        </div>
                      )}
                    </div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[24px] text-[#008b45] leading-none mb-[15px]">{opp.projectedReturn || 'Variable'} <span className="text-[13px] text-[#68736d] font-normal">{opp.projectedReturn ? '/ month' : ''}</span></div>
                    {oppCohort?.closesAt ? (
                      <div className="text-[12px] text-[#68736d] mb-[20px] flex items-center gap-[5px]">
                        Closes <CountdownTimer targetDate={oppCohort.closesAt} label="" />
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#68736d] mb-[20px]">{oppCohort?.status || 'OPEN'}</div>
                    )}
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">"""

new_farm = """<div key={opp.id} className="w-[280px] shrink-0 bg-[#182a20] border border-white/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                  <div className="z-10 relative">
                    <div className="flex justify-between items-start mb-[15px]">
                      <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider">FARM · {opp.location.toUpperCase()}</div>
                      {owned && (
                        <div className="bg-white/10 text-[#a9e7bd] text-[10px] font-bold px-[8px] py-[4px] rounded-[6px] text-center leading-tight">
                          You own<br/>{formatCurrency(owned.totalAmount).replace('.00', '')}
                        </div>
                      )}
                    </div>
                    <h3 className="font-manrope font-bold text-[20px] text-white mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[24px] text-[#a9e7bd] leading-none mb-[15px]">{opp.projectedReturn || 'Variable'} <span className="text-[13px] text-[#a6baa9] font-normal">{opp.projectedReturn ? '/ month' : ''}</span></div>
                    {oppCohort?.closesAt ? (
                      <div className="text-[12px] text-[#a6baa9] mb-[20px] flex items-center gap-[5px]">
                        Closes <div className="text-white font-mono"><CountdownTimer targetDate={oppCohort.closesAt} label="" /></div>
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#a6baa9] mb-[20px]">{oppCohort?.status || 'OPEN'}</div>
                    )}
                  </div>
                  <button className="z-10 relative w-full h-[40px] bg-[#a9e7bd] text-[#182a20] text-[13px] font-bold rounded-full hover:bg-[#86e2a6] transition-colors">"""

content = content.replace(old_farm, new_farm)

# Lands
old_land = """<div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND · {opp.location.toUpperCase()}</div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-ink leading-none mb-[15px]">{formatCurrency(opp.price || opp.pricePerUnit || 0)}</div>
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">"""

new_land = """<div key={opp.id} className="w-[280px] shrink-0 bg-[#182a20] border border-white/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                  <div className="z-10 relative">
                    <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[15px]">LAND · {opp.location.toUpperCase()}</div>
                    <h3 className="font-manrope font-bold text-[20px] text-white mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-[#a9e7bd] leading-none mb-[15px]">{formatCurrency(opp.price || opp.pricePerUnit || 0)}</div>
                  </div>
                  <button className="z-10 relative w-full h-[40px] bg-[#a9e7bd] text-[#182a20] text-[13px] font-bold rounded-full hover:bg-[#86e2a6] transition-colors">"""

content = content.replace(old_land, new_land)

# Land Banking
old_banking = """<div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND BANKING</div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-ink leading-none mb-[15px]">{formatCurrency(opp.acquisitionPrice || 0)}</div>
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">"""

new_banking = """<div key={opp.id} className="w-[280px] shrink-0 bg-[#182a20] border border-white/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                  <div className="z-10 relative">
                    <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[15px]">LAND BANKING</div>
                    <h3 className="font-manrope font-bold text-[20px] text-white mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-[#a9e7bd] leading-none mb-[15px]">{formatCurrency(opp.acquisitionPrice || 0)}</div>
                  </div>
                  <button className="z-10 relative w-full h-[40px] bg-[#a9e7bd] text-[#182a20] text-[13px] font-bold rounded-full hover:bg-[#86e2a6] transition-colors">"""

content = content.replace(old_banking, new_banking)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
