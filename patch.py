with open('src/app/dashboard/wallet/ClientWallet.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="p-[20px] lg:p-[30px] space-y-[20px]">',
    '<form className="p-[20px] lg:p-[30px] space-y-[20px]" action={async (formData) => { await fundWalletAction(formData); setIsFundModalOpen(false); }}>'
)

content = content.replace(
    '</button>\n              </div>\n            </div>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}',
    '</button>\n              </div>\n            </form>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}'
)

content = content.replace('onClick={() => {\n                  \n                  \n                }}', '')

with open('src/app/dashboard/wallet/ClientWallet.tsx', 'w') as f:
    f.write(content)
