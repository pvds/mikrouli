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
- [x] implement shortcodes for contentful ~~(like `{{dialog:booking(intake)}}` to 
  include a booking dialog~~ and `{{embed:youtube(https://youtube.com/...)}}` 
  to embed a youtube video)
~~- [ ] explore migrating to mdsvex to allow for svelte components in markdown~~

#### Global

- [ ] build in logic to ensure staging is not indexed but production is.
- [x] overwrite default typography (prose) variables, colors for sure
- [ ] consider using custom utility classes for generated content (prose) 
  instead of typography plugin
- [x] use rem for font sizes, but not for dimensions and spacing (use px/em)

#### FAQ

- [ ] add FAQ content type
- [ ] add FAQ section to homepage
- [ ] add FAQ page
- [ ] add FAQ component

#### Homepage

- [x] add Services section
- [ ] add Reviews section (done but hidden; needs real reviews)
- [x] add Contact section
- [x] add Blog section

#### Services

- [x] services overview
  - [x] ServiceSection component (using ServiceCard)
  - [x] ServiceCard component
- [x] service detail
  - [x] ServiceDetail component

#### Blog

- [x] blog overview
  - [x] BlogSection component (using BlogCard)
  - [x] BlogCard component
- [x] blog detail
  - [x] BlogDetail component

#### Contact

- [x] add ways to contact

### Fix

- [x] Seo component server side rendering (getting hydration warnings now)
- [x] a11y issue due to nesting non `li` in `ul` in `NavPrimary` component
- [x] for some reason local lighthouse seo test is 100% on github build while 
  robots.txt has disallow and meta tag with noindex nofollow is set. Would 
  expect a failure like when running on the netlify build.
- [ ] image sync is based on image name > same image name but different 
  image is not detected

### Refactor

- [ ] merge Hero and HeroImage components

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
~~- [ ] cache cms images in pipeline to avoid downloading them every time~~
- [ ] add a test job (once vitest or playwright tests are added)
- [x] optimize flow
	- for different scenarios
    - for when site is launched

### Security

- [ ] add security checks
- [x] check desired cors settings
