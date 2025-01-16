# TODO list

## 1.0.0

### Features

#### CMS

- [ ] add seo fields to page/service/post pages (update types and transform.js)
- [ ] change transform.js to automatically include new fields
- [ ] decide on a way to handle images (contentful/local files/Some CDN)
- [ ] decide on using a `content` field (use `---` to divide in sections) or 
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

### Tests

- [ ] axe and lighthouse tests should reuse logic
- [ ] log issues when found in lighthouse test

### Documentation

- [ ] update README.md with latest changes
- [ ] add a CHANGELOG.md file (possible integrate conventional commits to 
  automate)

### CI/CD

- [ ] optimize for speed
- [ ] cleanup by splitting steps into templates
- [ ] optimize flow
	- for different scenarios
    - for when site is launched

### Security

- [ ] add security checks
- [ ] check desired cors settings
