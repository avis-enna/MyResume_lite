# Page snapshot

```yaml
- alert
- banner:
  - link:
    - /url: /admin
    - img
  - heading "EDIT ABOUT" [level=1]
  - button "Save Changes"
- main:
  - text: Full Name
  - textbox "Enter your full name": Enhanced Test 1755423027620
  - text: Professional Title
  - textbox "e.g. Software Engineer · Cisco Systems": Senior Software Engineer
  - text: Bio - First Paragraph
  - textbox "First paragraph of your bio...": Experienced software engineer with 8+ years of expertise in full-stack development.
  - text: Bio - Second Paragraph
  - textbox "Second paragraph of your bio...": Passionate about creating scalable web applications and mentoring junior developers.
  - text: Email
  - textbox "your.email@example.com"
  - text: LinkedIn URL
  - textbox "https://linkedin.com/in/yourprofile"
  - text: GitHub URL
  - textbox "https://github.com/yourusername"
  - button "Save Changes"
```