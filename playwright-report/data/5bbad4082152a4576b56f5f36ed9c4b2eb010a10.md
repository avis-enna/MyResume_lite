# Page snapshot

```yaml
- alert
- banner:
  - link "← Back to Experience":
    - /url: /admin/experience
  - heading "Add Experience" [level=1]
- main:
  - text: Company
  - textbox "Company name": Test Company
  - text: Position
  - textbox "Job title": Test Position
  - text: Location
  - textbox "City, Country"
  - text: Start Date
  - textbox "e.g., January 2024": 2023-01-01
  - text: End Date
  - textbox "e.g., December 2024": 2023-12-31
  - checkbox
  - text: Current Position Description (Key Responsibilities)
  - textbox "Describe a key responsibility or achievement"
  - button "Add Description"
  - text: Technologies & Skills
  - textbox "Technology or skill"
  - button "Add Technology"
  - link "Cancel":
    - /url: /admin/experience
  - button "Create Experience"
```