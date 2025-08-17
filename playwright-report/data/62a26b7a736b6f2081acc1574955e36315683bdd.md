# Page snapshot

```yaml
- alert
- banner:
  - link "← Back to Dashboard":
    - /url: /admin/dashboard
  - heading "Edit Contact Section" [level=1]
- main:
  - heading "Contact Information" [level=2]
  - text: Email
  - textbox "Enter your email": john.doe@example.com
  - text: Phone
  - textbox "Enter your phone number": +1-555-0123
  - text: Location
  - textbox "Enter your location": San Francisco, CA
  - text: LinkedIn URL
  - textbox "https://linkedin.com/in/yourprofile": https://linkedin.com/in/johndoe
  - text: GitHub URL
  - textbox "https://github.com/yourusername": https://github.com/johndoe
  - text: Website URL
  - textbox "https://yourwebsite.com": https://johndoe.dev
  - button "Save Changes"
```