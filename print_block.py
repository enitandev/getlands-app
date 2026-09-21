with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

start = content.find('<Text style={{styles.bold}}>LEGAL COUNSEL</Text>')
if start == -1:
    start = content.find('LEGAL COUNSEL')
print(content[start-300:start+300])
