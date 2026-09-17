with open('src/components/ui/LandBankingCard.tsx', 'r') as f:
    content = f.read()

# Add the pill over the image
image_div = """      <div 
        className={`h-[180px] bg-cover bg-center ${photoClass}`} 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />"""

new_image_div = """      <div 
        className={`h-[180px] bg-cover bg-center relative ${photoClass}`} 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        <div className="absolute top-[15px] left-[15px] bg-white/90 text-ink px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">
          {duration}
        </div>
      </div>"""

content = content.replace(image_div, new_image_div)

# Remove duration from the bottom grid
old_grid = """        <div className="grid grid-cols-2 gap-[10px] mt-auto border-t border-black/5 pt-[10px]">
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Entry</span>
            <b className="font-manrope text-[15px] text-ink">{entryPrice}</b>
          </div>
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Expected Exit</span>
            <b className="font-manrope text-[15px] text-[#008b45]">{exitPrice}</b>
          </div>
          <div className="col-span-2">
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Holding Period</span>
            <b className="font-manrope text-[13px] text-ink">{duration}</b>
          </div>
        </div>"""

new_grid = """        <div className="grid grid-cols-2 gap-[10px] mt-auto border-t border-black/5 pt-[10px]">
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Entry</span>
            <b className="font-manrope text-[15px] text-ink">{entryPrice}</b>
          </div>
          <div>
            <span className="block text-[9px] text-[#77817c] uppercase tracking-wider mb-[2px]">Expected Exit</span>
            <b className="font-manrope text-[15px] text-[#008b45]">{exitPrice}</b>
          </div>
        </div>"""

content = content.replace(old_grid, new_grid)

with open('src/components/ui/LandBankingCard.tsx', 'w') as f:
    f.write(content)
