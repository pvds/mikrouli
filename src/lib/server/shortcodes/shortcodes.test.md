## 1. YouTube Shortcode Tests

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352 0a32 32 0 0 0-23 55l42 41-170 169a32 32 0 0 0 46 46l169-170 41 42c10 9 23 12 35 7s20-17 20-30V32c0-18-14-32-32-32H352zM80 32C36 32 0 68 0 112v320c0 44 36 80 80 80h320c44 0 80-36 80-80V320a32 32 0 1 0-64 0v112c0 9-7 16-16 16H80c-9 0-16-7-16-16V112c0-9 7-16 16-16h112a32 32 0 1 0 0-64H80z"/></svg>

### a. Standard Usage
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Never Gonna Give You Up"}}

### b. Embed URL without Title
{{youtube url="https://www.youtube.com/embed/dQw4w9WgXcQ"}}

### c. With Width and Height
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Custom Size Video" width="800" height="450"}}

### d. Controls Enabled
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" controls="true"}}

### e. Extra Spaces Between Attributes
{{youtube    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"    title="Spaced Attributes"    }}

### f. Attributes with Extra Spaces Around Equals
{{youtube url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" title = "Extra Spaces Around Equals"}}

### g. Missing Optional Attributes
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}

### h. Malformed Attributes (Missing Quotes)
{{youtube url=https://www.youtube.com/watch?v=dQw4w9WgXcQ title="Missing Quotes Around URL"}}

### i. Shortcode with Trailing Spaces Inside Braces
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Trailing Spaces"  }}

### j. Inline Shortcode (Adjacent to Text)
Here is a video: {{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}

## 2. Link Shortcode Tests

### a. Internal Link with Primary Variant
{{link url="/about" text="About Us" variant="primary"}}

### b. External Link with Secondary Variant
{{link url="https://external.com" text="External Site" variant="secondary"}}

### c. Internal Link without Specified Variant
{{link url="/contact" text="Contact Us"}}

### d. External Link without Variant
{{link url="https://openai.com" text="OpenAI"}}

### e. Link with Extra Spaces Between Attributes
{{link    url="/services"    text="Our Services"    variant="primary"    }}

### f. Attributes with Extra Spaces Around Equals
{{link url = "/portfolio" text = "Our Portfolio" variant = "secondary"}}

### g. Missing Optional Attributes
{{link url="/home" text="Home"}}

### h. Malformed Attributes (Missing Quotes)
{{link url=/blog text="Blog Page" variant="primary"}}

### i. Link with Trailing Spaces Inside Braces
{{link url="/faq" text="FAQ" variant="secondary"  }}

### j. Inline Link Shortcode (Adjacent to Text)
Check out our {{link url="/features" text="Features"}} for more information.

### k. Single and double quoted attributes
{{link url="/features" text='Features'}}

## 3. Combined Shortcode Tests

### a. Multiple Shortcodes with Proper Separation
## Welcome to Our Site

Explore our features below:

{{link url="/features" text="Features" variant="primary"}}

Watch our introduction video:

{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Introduction Video"}}

Learn more about us:

{{link url="/about" text="About Us" variant="secondary"}}

### b. Multiple Shortcodes with Extra Spaces and Inline Shortcodes
## Our Journey

We started with a mission to innovate.

{{  youtube    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"    title="Our Mission Video"  }}

Discover our story through the link: {{link url="/story" text="Our Story" variant="primary"  }}

Stay connected:

{{link    url="https://twitter.com"    text="Twitter"    variant="secondary"    }}

### c. Shortcodes Adjacent to Markdown Elements Without Proper Separation
## Our Vision{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Vision Video"}}

We aim to revolutionize the industry.

## Another Heading{{link url="/new" text="New Link" variant="primary"}}

This should not be a code block.

## 4. Edge Case Tests

### a. Shortcode with No Attributes
{{youtube}}

### b. Shortcode with Unknown Variant
{{link url="/unknown" text="Unknown Variant" variant="tertiary"}}

### c. Nested Shortcodes (If Supported)
{{link url="/parent" text="Parent Link" variant="primary"}}
{{link url="/child" text="Child Link" variant="secondary"}}

### d. Shortcode with Special Characters in Attributes
{{link url="/search?q=react&lang=en" text="Search & Find" variant="primary"}}

### e. Shortcode with Single Quotes
{{youtube url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' title='Single Quote Title'}}

### f. Shortcode with Escaped Characters
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Escape &amp; Characters"}}

### g. Shortcode with Additional Unexpected Attributes
{{link url="/extra" text="Extra Attributes" variant="primary" target="_self"}}

## 5. Shortcodes Inside Lists

### a. YouTube Shortcode Inside an Unordered List
- Introduction Video:
  {{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Intro Video"}}

### b. Link Shortcode Inside an Ordered List
1. Visit our [About Page]({{link url="/about" text="About Us" variant="primary"}})
2. Check out our [Services]({{link url="/services" text="Our Services" variant="secondary"}})

### c. Mixed Shortcodes Inside a List
- **Feature Highlight:**
  {{link url="/features" text="Features" variant="primary"}}
- **Watch Our Video:**
  {{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Feature Video"}}

## 6. Shortcodes Inside Blockquotes

### a. YouTube Shortcode Inside a Blockquote
> Here is an inspiring video:
> {{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Inspiring Video"}}

### b. Link Shortcode Inside a Blockquote
> For more details, visit {{link url="/details" text="Details Page" variant="secondary"}}.

## 7. Shortcodes Inside Code Blocks (Should Not Be Parsed)

### a. YouTube Shortcode Inside a Fenced Code Block
```markdown
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Code Block Video"}}
```

### b. Link Shortcode Inside a Fenced Code Block
```markdown
{{link url="/code" text="Code Link" variant="primary"}}
```

## 8. Shortcodes with Line Breaks and Indentation

### a. YouTube Shortcode with Line Breaks
{{youtube
url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
title="Multiline Attributes"
}}

### b. Link Shortcode with Indented Attributes
{{link
url="/indented"
text="Indented Link"
variant="primary"
}}

## 9. Shortcodes with Non-Standard Attribute Order

### a. YouTube Shortcode with Different Attribute Order
{{youtube title="Different Order" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}

### b. Link Shortcode with Different Attribute Order
{{link text="Different Order" variant="secondary" url="/different"}}

## 10. Shortcodes with URL Parameters and Encoding

### a. YouTube Shortcode with URL Parameters
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share" title="Video with Parameters"}}

### b. Link Shortcode with Encoded Characters
{{link url="https://example.com/page?name=John%20Doe&age=30" text="John's Page" variant="primary"}}

## 11. Shortcodes That Should Not Be Rendered

### a. YouTube Shortcode Missing Required 'url' Attribute
{{youtube title="Missing URL"}}

### b. Link Shortcode Missing Required 'url' Attribute
{{link text="Missing URL" variant="primary"}}

### c. Link Shortcode Missing Required 'text' Attribute
{{link url="/missing-text" variant="secondary"}}

### d. YouTube Shortcode with Empty 'url' Attribute
{{youtube url="" title="Empty URL"}}

### e. Link Shortcode with Empty 'url' Attribute
{{link url="" text="Empty URL" variant="primary"}}

### f. YouTube Shortcode with Invalid URL
{{youtube url="invalid_url" title="Invalid URL"}}

### g. Link Shortcode with Invalid URL
{{link url="htp://invalid-url" text="Invalid URL" variant="primary"}}

### h. Shortcode with Unknown Name
{{unknown url="/unknown" text="Unknown Shortcode"}}

### i. Shortcode with Missing Both Required Attributes
{{youtube}}
{{link}}

### j. Shortcode with Extra Unrelated Braces
{{youtube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Extra Braces"}}}

{{{link url="/extra-braces" text="Extra Braces" variant="primary"}}}
