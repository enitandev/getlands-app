# Fix ClientAnnouncements
with open('src/app/admin/announcements/ClientAnnouncements.tsx', 'r') as f:
    content = f.read()

content = content.replace('''            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={async (formData) => {
              await createAnnouncement(formData);
              
            }}
              
              
              
            }}>''', '''            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={async (formData) => {
              await createAnnouncement(formData);
            }}>''')

with open('src/app/admin/announcements/ClientAnnouncements.tsx', 'w') as f:
    f.write(content)

# Fix ClientCheckout
with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content2 = f.read()

# I deleted the <main> wrapper in patch_checkout_2, but did I delete the closing tags?
# Let's count divs and forms. The original file had a <main> which was deleted.
# Let's just fix it properly by finding the main flex container and matching its divs.
