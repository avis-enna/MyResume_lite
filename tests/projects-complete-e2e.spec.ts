import { test, expect } from '@playwright/test';

// Test data for comprehensive testing
const testProjects = {
  fullProject: {
    title: 'E2E Test Full Stack Application',
    description: 'A comprehensive full-stack application built for end-to-end testing purposes. This project demonstrates complete CRUD operations, real-time features, and modern web development practices.',
    technologies: 'React, TypeScript, Node.js, Express, MongoDB, Socket.io, Docker, AWS',
    features: 'Real-time chat functionality\nUser authentication and authorization\nRESTful API with comprehensive endpoints\nResponsive design with mobile-first approach\nAutomated testing with Jest and Playwright\nCI/CD pipeline with GitHub Actions\nDocker containerization\nAWS deployment with load balancing',
    githubUrl: 'https://github.com/test-user/e2e-fullstack-app',
    liveUrl: 'https://e2e-fullstack-demo.herokuapp.com',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    featured: true,
    order: 1
  },
  
  minimalProject: {
    title: 'Minimal Test Project ' + Date.now(),
    description: 'A minimal project with only required fields for testing edge cases.',
    technologies: 'JavaScript',
    features: 'Basic functionality',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
    order: 10
  },
  
  githubOnlyProject: {
    title: 'Open Source Library ' + Date.now(),
    description: 'An open-source JavaScript library for data visualization. Available on GitHub but no live demo.',
    technologies: 'JavaScript, D3.js, Canvas API',
    features: 'Interactive charts and graphs\nCustomizable themes\nExport to PNG/SVG\nResponsive design',
    githubUrl: 'https://github.com/test-user/data-viz-library',
    liveUrl: '',
    imageUrl: '',
    featured: true,
    order: 2
  },
  
  liveOnlyProject: {
    title: 'Proprietary Web Application',
    description: 'A proprietary web application with live demo but private source code.',
    technologies: 'Vue.js, Python, Django, PostgreSQL',
    features: 'Advanced analytics dashboard\nReal-time data processing\nUser management system\nAPI integration',
    githubUrl: '',
    liveUrl: 'https://proprietary-app-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    featured: false,
    order: 3
  },
  
  updatedProject: {
    title: 'UPDATED: Advanced Machine Learning Platform',
    description: 'UPDATED: A sophisticated machine learning platform with automated model training, deployment, and monitoring capabilities. This project showcases advanced AI/ML engineering practices.',
    technologies: 'Python, TensorFlow, Kubernetes, Docker, FastAPI, React, PostgreSQL, Redis',
    features: 'Automated model training pipelines\nReal-time model serving with FastAPI\nKubernetes-based auto-scaling\nModel performance monitoring\nA/B testing framework\nData versioning with DVC\nMLOps best practices\nIntegrated Jupyter notebooks',
    githubUrl: 'https://github.com/test-user/updated-ml-platform',
    liveUrl: 'https://updated-ml-platform-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    featured: true,
    order: 0
  }
};

test.describe('Projects Complete E2E Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all projects before each test for isolation
    await page.request.delete('/api/admin/projects/clear-all');

    // Navigate to admin login
    await page.goto('/admin');

    // Login with admin credentials
    await page.fill('input[name="email"]', 'admin@admin.com');
    await page.fill('input[name="password"]', '$iva@V3nna21');
    await page.click('button[type="submit"]');

    // Wait for redirect to admin dashboard
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should create project with all fields and verify on portfolio', async ({ page }) => {
    const project = testProjects.fullProject;
    
    // Navigate to projects and create new project
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    // Seed projects first to ensure we have data
    const seedResponse = await page.request.post('/api/admin/projects/seed');
    expect(seedResponse.ok()).toBeTruthy();
    
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    // Fill all form fields
    await page.fill('input[name="title"]', project.title);
    await page.fill('textarea[name="description"]', project.description);
    await page.fill('input[name="technologies"]', project.technologies);
    await page.fill('textarea[name="features"]', project.features);
    await page.fill('input[name="githubUrl"]', project.githubUrl);
    await page.fill('input[name="liveUrl"]', project.liveUrl);
    await page.fill('input[name="imageUrl"]', project.imageUrl);
    await page.fill('input[name="order"]', project.order.toString());
    
    if (project.featured) {
      await page.check('input[name="featured"]');
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Verify project appears in admin list
    await expect(page.locator(`text=${project.title}`)).toBeVisible();
    
    // Navigate to portfolio and verify project appears
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${project.title}")`)).toBeVisible();
    await expect(page.locator(`text=${project.description}`)).toBeVisible();
    
    // Verify technologies are displayed (use more specific selectors)
    const projectCard = page.locator(`div:has(h2:has-text("${project.title}"))`).first();
    const techArray = project.technologies.split(', ');
    for (const tech of techArray.slice(0, 2)) { // Check first 2 technologies
      await expect(projectCard.locator(`span:has-text("${tech}")`)).toBeVisible();
    }

    // Verify features are displayed (check in project description area)
    const featuresArray = project.features.split('\n');
    for (const feature of featuresArray.slice(0, 1)) { // Check first feature
      await expect(projectCard.locator(`text=${feature}`)).toBeVisible();
    }
    
    // Verify both links are present
    await expect(page.locator(`a[href="${project.githubUrl}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${project.liveUrl}"]`)).toBeVisible();
    
    // Verify featured badge
    if (project.featured) {
      await expect(page.locator('text=Featured Project').first()).toBeVisible();
    }
  });

  test('should create minimal project and verify conditional link display', async ({ page }) => {
    const project = testProjects.minimalProject;
    
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    // Fill only required fields
    await page.fill('input[name="title"]', project.title);
    await page.fill('textarea[name="description"]', project.description);
    await page.fill('input[name="technologies"]', project.technologies);
    await page.fill('textarea[name="features"]', project.features);
    
    // Leave URLs empty to test conditional display
    
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Verify on portfolio
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${project.title}")`).first()).toBeVisible();
    
    // Verify NO links are displayed for this project
    const projectCard = page.locator(`div:has(h2:has-text("${project.title}"))`).first();

    // Check that this specific project card has no links
    const linksInCard = await projectCard.locator('a').count();
    expect(linksInCard).toBe(0);

    // Verify no featured badge in this card
    const featuredBadgeInCard = await projectCard.locator('text=Featured Project').count();
    expect(featuredBadgeInCard).toBe(0);
  });

  test('should create GitHub-only project and verify single link display', async ({ page }) => {
    const project = testProjects.githubOnlyProject;
    
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    await page.fill('input[name="title"]', project.title);
    await page.fill('textarea[name="description"]', project.description);
    await page.fill('input[name="technologies"]', project.technologies);
    await page.fill('textarea[name="features"]', project.features);
    await page.fill('input[name="githubUrl"]', project.githubUrl);
    // Leave liveUrl empty
    await page.fill('input[name="order"]', project.order.toString());
    
    if (project.featured) {
      await page.check('input[name="featured"]');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Verify on portfolio
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${project.title}")`)).toBeVisible();
    
    // Verify only GitHub link is displayed
    const projectCard = page.locator(`div:has(h2:has-text("${project.title}"))`).first();
    await expect(projectCard.locator(`a[href="${project.githubUrl}"]`)).toBeVisible();

    // Check that this card has exactly 1 link (GitHub only)
    const linksInCard = await projectCard.locator('a').count();
    expect(linksInCard).toBe(1);
  });

  test('should create live-demo-only project and verify single link display', async ({ page }) => {
    const project = testProjects.liveOnlyProject;
    
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');
    
    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');
    
    await page.fill('input[name="title"]', project.title);
    await page.fill('textarea[name="description"]', project.description);
    await page.fill('input[name="technologies"]', project.technologies);
    await page.fill('textarea[name="features"]', project.features);
    // Leave githubUrl empty
    await page.fill('input[name="liveUrl"]', project.liveUrl);
    await page.fill('input[name="imageUrl"]', project.imageUrl);
    await page.fill('input[name="order"]', project.order.toString());
    
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');
    
    // Verify on portfolio
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${project.title}")`)).toBeVisible();
    
    // Verify only Live Demo link is displayed
    const projectCard = page.locator(`div:has(h2:has-text("${project.title}"))`).first();
    await expect(projectCard.locator(`a[href="${project.liveUrl}"]`)).toBeVisible();

    // Check that this card has exactly 1 link (Live Demo only)
    const linksInCard = await projectCard.locator('a').count();
    expect(linksInCard).toBe(1);
  });

  test('should edit existing project and change ALL details', async ({ page }) => {
    const originalProject = testProjects.fullProject;
    const updatedProject = testProjects.updatedProject;

    // First create the original project
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');

    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');

    // Create original project
    await page.fill('input[name="title"]', originalProject.title);
    await page.fill('textarea[name="description"]', originalProject.description);
    await page.fill('input[name="technologies"]', originalProject.technologies);
    await page.fill('textarea[name="features"]', originalProject.features);
    await page.fill('input[name="githubUrl"]', originalProject.githubUrl);
    await page.fill('input[name="liveUrl"]', originalProject.liveUrl);
    await page.fill('input[name="imageUrl"]', originalProject.imageUrl);
    await page.fill('input[name="order"]', originalProject.order.toString());

    if (originalProject.featured) {
      await page.check('input[name="featured"]');
    }

    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');

    // Verify original project on portfolio
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${originalProject.title}")`).first()).toBeVisible();

    // Go back to admin and edit the project
    await page.goto('/admin/projects');

    // Find and click edit button for the project
    const projectRow = page.locator(`tr:has-text("${originalProject.title}")`);
    await projectRow.locator('a:has-text("Edit")').click();

    // Wait for edit page
    await page.waitForURL(/\/admin\/projects\/.*\/edit/);

    // Clear and update ALL fields
    await page.fill('input[name="title"]', '');
    await page.fill('input[name="title"]', updatedProject.title);

    await page.fill('textarea[name="description"]', '');
    await page.fill('textarea[name="description"]', updatedProject.description);

    await page.fill('input[name="technologies"]', '');
    await page.fill('input[name="technologies"]', updatedProject.technologies);

    await page.fill('textarea[name="features"]', '');
    await page.fill('textarea[name="features"]', updatedProject.features);

    await page.fill('input[name="githubUrl"]', '');
    await page.fill('input[name="githubUrl"]', updatedProject.githubUrl);

    await page.fill('input[name="liveUrl"]', '');
    await page.fill('input[name="liveUrl"]', updatedProject.liveUrl);

    await page.fill('input[name="imageUrl"]', '');
    await page.fill('input[name="imageUrl"]', updatedProject.imageUrl);

    await page.fill('input[name="order"]', '');
    await page.fill('input[name="order"]', updatedProject.order.toString());

    // Update featured status
    const featuredCheckbox = page.locator('input[name="featured"]');
    const isCurrentlyChecked = await featuredCheckbox.isChecked();
    if (isCurrentlyChecked !== updatedProject.featured) {
      if (updatedProject.featured) {
        await featuredCheckbox.check();
      } else {
        await featuredCheckbox.uncheck();
      }
    }

    // Submit the update
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');

    // Verify updated project appears in admin list
    await expect(page.locator(`text=${updatedProject.title}`)).toBeVisible();
    await expect(page.locator(`text=${originalProject.title}`)).not.toBeVisible();

    // Verify ALL changes on portfolio
    await page.goto('/projects');

    // Verify old project is gone
    await expect(page.locator(`h2:has-text("${originalProject.title}")`)).not.toBeVisible();

    // Verify new project details
    await expect(page.locator(`h2:has-text("${updatedProject.title}")`)).toBeVisible();
    await expect(page.locator(`text=${updatedProject.description}`)).toBeVisible();

    // Verify updated technologies
    const updatedTechArray = updatedProject.technologies.split(', ');
    for (const tech of updatedTechArray.slice(0, 3)) {
      await expect(page.locator(`text=${tech}`)).toBeVisible();
    }

    // Verify updated features
    const updatedFeaturesArray = updatedProject.features.split('\n');
    for (const feature of updatedFeaturesArray.slice(0, 2)) {
      await expect(page.locator(`text=${feature}`)).toBeVisible();
    }

    // Verify updated links
    await expect(page.locator(`a[href="${updatedProject.githubUrl}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${updatedProject.liveUrl}"]`)).toBeVisible();

    // Verify old links are gone
    await expect(page.locator(`a[href="${originalProject.githubUrl}"]`)).not.toBeVisible();
    await expect(page.locator(`a[href="${originalProject.liveUrl}"]`)).not.toBeVisible();
  });

  test('should handle form validation and error cases', async ({ page }) => {
    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');

    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();

    // Fill with invalid data
    await page.fill('input[name="title"]', 'AB'); // Too short
    await page.fill('textarea[name="description"]', 'Short'); // Too short
    await page.fill('input[name="githubUrl"]', 'invalid-url');
    await page.fill('input[name="liveUrl"]', 'also-invalid');

    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Title must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Description must be at least 10 characters')).toBeVisible();
    await expect(page.locator('text=Please enter a valid GitHub URL')).toBeVisible();
    await expect(page.locator('text=Please enter a valid live URL')).toBeVisible();
  });

  test('should verify basic project creation and display', async ({ page }) => {
    // Create a simple project to verify basic functionality
    const project = {
      title: 'Simple Test Project',
      description: 'A simple project for testing basic functionality.',
      technologies: 'JavaScript, HTML, CSS',
      features: 'Basic web functionality\nResponsive design',
      githubUrl: 'https://github.com/test/simple-project',
      liveUrl: 'https://simple-project.com',
      order: 1,
      featured: true
    };

    await page.click('a[href="/admin/projects"]');
    await page.waitForURL('/admin/projects');

    await page.click('text=ADD PROJECT');
    await page.waitForURL('/admin/projects/new');

    await page.fill('input[name="title"]', project.title);
    await page.fill('textarea[name="description"]', project.description);
    await page.fill('input[name="technologies"]', project.technologies);
    await page.fill('textarea[name="features"]', project.features);
    await page.fill('input[name="githubUrl"]', project.githubUrl);
    await page.fill('input[name="liveUrl"]', project.liveUrl);
    await page.fill('input[name="order"]', project.order.toString());
    await page.check('input[name="featured"]');

    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/projects');

    // Verify on portfolio
    await page.goto('/projects');
    await expect(page.locator(`h2:has-text("${project.title}")`)).toBeVisible();
    await expect(page.locator(`text=${project.description}`)).toBeVisible();
    await expect(page.locator('text=Featured Project').first()).toBeVisible();

    // Verify both links exist
    const projectCard = page.locator(`div:has(h2:has-text("${project.title}"))`).first();
    await expect(projectCard.locator(`a[href="${project.githubUrl}"]`)).toBeVisible();
    await expect(projectCard.locator(`a[href="${project.liveUrl}"]`)).toBeVisible();
  });
});
