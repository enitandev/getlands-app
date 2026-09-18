import re

format_func = """
  const formatDuration = (val: string) => {
    if (!val) return '';
    const isNumeric = /^\\d+$/.test(val.trim());
    return isNumeric ? `${val} MONTHS` : val;
  };
"""

# Patch FarmCard
with open('src/components/ui/FarmCard.tsx', 'r') as f:
    farm = f.read()

farm = farm.replace(
    "export function FarmCard({ crop, cycle, title, location, targetReturn, returnsFrequency, price, photoClass = '', imageUrl, className = '' }: FarmCardProps) {",
    "export function FarmCard({ crop, cycle, title, location, targetReturn, returnsFrequency, price, photoClass = '', imageUrl, className = '' }: FarmCardProps) {" + format_func
)

farm = farm.replace(
    "{cycle}",
    "{formatDuration(cycle)}"
)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(farm)

# Patch LandBankingCard
with open('src/components/ui/LandBankingCard.tsx', 'r') as f:
    land = f.read()

land = land.replace(
    "export function LandBankingCard({ title, location, duration, entryPrice, exitPrice, photoClass = '', imageUrl, className = '', status }: LandBankingCardProps) {",
    "export function LandBankingCard({ title, location, duration, entryPrice, exitPrice, photoClass = '', imageUrl, className = '', status }: LandBankingCardProps) {" + format_func
)

land = land.replace(
    "{duration}",
    "{formatDuration(duration)}"
)

with open('src/components/ui/LandBankingCard.tsx', 'w') as f:
    f.write(land)

