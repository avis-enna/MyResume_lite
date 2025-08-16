# Page snapshot

```yaml
- banner:
  - link "← Projects":
    - /url: /admin/projects
  - heading "Edit Project" [level=1]
- main:
  - text: Failed to load project Title
  - textbox "Project title"
  - text: Description
  - textbox "Project description"
  - text: Technologies (comma separated)
  - textbox "Technologies"
  - text: Features (one per line)
  - textbox "Features"
  - text: GitHub URL
  - textbox "GitHub URL"
  - text: Live URL
  - textbox "Live URL"
  - text: Image URL
  - textbox "Image URL"
  - text: Order (number)
  - spinbutton "Order": "0"
  - checkbox "Featured project"
  - text: Featured project
  - button "Save Changes"
  - link "Cancel":
    - /url: /admin/projects
- alert
```