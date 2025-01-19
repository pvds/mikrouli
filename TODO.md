# TODO list

## 1.0.0

### Features

#### CMS

- [x] add seo fields to page/service/post pages (update types and transform.js)
- [x] change transform.js to automatically include new fields
- [x] decide on a way to handle images (contentful/local files/Some CDN)
- [x] decide on using a `content` field (use `---` to divide in sections) or 
  `sections` content type

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

- [ ] axe and lighthouse tests should reuse logic
- [ ] log issues when found in lighthouse test
  - [x] provide log to report for local use
  - [ ] decide on using custom logging or letting lighthouse do it

### Documentation

- [ ] update README.md with latest changes
- [ ] add a CHANGELOG.md file (possible integrate conventional commits to 
  automate)

### CI/CD

- [ ] optimize for speed
- [ ] cleanup by splitting steps into templates
- [ ] add a test job (once vitest or playwright tests are added)
- [x] optimize flow
	- for different scenarios
    - for when site is launched

### Security

- [ ] add security checks
- [ ] check desired cors settings
