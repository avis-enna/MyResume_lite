# Page snapshot

```yaml
- alert
- banner:
  - link "← Back to Dashboard":
    - /url: /admin/dashboard
  - heading "Manage Blog Posts" [level=1]
  - link "Write New Post":
    - /url: /admin/blog/new
- main:
  - img
  - heading "No blog posts" [level=3]
  - paragraph: Get started by writing your first blog post.
  - link "Write New Post":
    - /url: /admin/blog/new
```