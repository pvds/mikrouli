# TODO list

## 1.0.0

### Features

#### Automation

- [x] ensure all content and images (raw + optimized) are in sync

#### CMS

- [x] add seo fields to page/service/post pages (update types and process.js)
- [x] change process.js to automatically include new fields
- [x] decide on a way to handle images (contentful/local files/Some CDN)
- [x] decide on using a `content` field (use `---` to divide in sections) or 
  `sections` content type
- [ ] add reference field to page content type to link to services or other 
  pages (can be used to get data like slug but also to facilitate nested 
  navigation and linking)
- [ ] implement shortcodes for contentful (like `{{dialog:booking(intake)}}` to 
  include a booking dialog and `{{embed:youtube(https://youtube.com/...)}}` 
  to embed a youtube video)

#### Global

- [ ] build in logic to ensure staging is not indexed but production is.

#### Homepage

- [ ] add Services section
- [ ] add Testimonials section
- [ ] add Contact section
- [ ] add Blog section
- [ ] make Footer section

#### Services

- [ ] services overview
  - [ ] ServiceSection component (using ServiceCard)
  - [ ] ServiceCard component
- [ ] service detail
  - [ ] ServiceDetail component

#### Blog

- [ ] blog overview
  - [ ] BlogSection component (using BlogCard)
  - [ ] BlogCard component
- [ ] blog detail
  - [ ] BlogDetail component

#### Contact

- [ ] contact form
  - [ ] ContactForm component

### Fixes

- [ ] Seo component server side rendering (getting hydration warnings now)
- [x] a11y issue due to nesting non `li` in `ul` in `NavPrimary` component
- [x] for some reason local lighthouse seo test is 100% on github build while 
  robots.txt has disallow and meta tag with noindex nofollow is set. Would 
  expect a failure like when running on the netlify build.

### Tests

- [x] axe and lighthouse tests should reuse logic
- [ ] log issues when found in lighthouse test
  - [x] provide log to report for local use
  - [ ] decide on using custom logging or letting lighthouse do it

### Documentation

- [ ] update README.md with latest changes
- [ ] add a CHANGELOG.md file (possible integrate conventional commits to 
  automate)

### CI/CD

- [x] balance speed and reliability
- [x] cleanup by splitting steps into templates
- [ ] cache cms images in pipeline to avoid downloading them every time
- [ ] add a test job (once vitest or playwright tests are added)
- [x] optimize flow
	- for different scenarios
    - for when site is launched

### Security

- [ ] add security checks
- [ ] check desired cors settings
