# Legal Policies Setup Guide

This guide will help you replace the placeholder content in your Terms and Conditions, Privacy Policy, and Cookie Policy pages with your actual legal content.

## 📋 Overview

Your website now has dedicated pages for:
- **Terms and Conditions**: `/terms`
- **Privacy Policy**: `/privacy` 
- **Cookie Policy**: `/cookies`

All pages are accessible from the footer on both the landing page and dashboard.

### 🔐 User Registration Terms Agreement

The registration form now includes:
- **Required checkbox** for Terms and Conditions agreement
- **Links to legal pages** directly from the registration form
- **Database tracking** of when users agreed to terms (`termsAgreedAt` field)
- **Validation** that prevents registration without agreement
- **Legal links** in login form and auth page footer

## 🔧 How to Update Your Policies

### Option 1: Direct Page Updates (Recommended)

#### For Terms and Conditions:
1. Open `app/terms/page.tsx`
2. Find the section marked with `{/* Terms Content - Replace this with your actual HTML content */}`
3. Replace the placeholder content with your actual Terms and Conditions HTML
4. Keep the same styling classes for consistency

#### For Cookie Policy:
1. Open `app/cookies/page.tsx`
2. Find the section marked with `{/* Cookie Policy Content */}`
3. Replace the placeholder content with your actual Cookie Policy HTML
4. Keep the same styling classes for consistency

#### For Privacy Policy:
1. Open `app/privacy/page.tsx`
2. Find the section marked with `{/* Privacy Policy Content */}`
3. Replace the placeholder content with your actual Privacy Policy HTML
4. **OR** update the external link button to point to your actual privacy policy URL

### Option 2: Using Reusable Components

#### For Terms and Conditions:
1. Open `components/legal/terms-content.tsx`
2. Replace the content inside the component with your actual Terms and Conditions
3. Import and use this component in `app/terms/page.tsx`

#### For Cookie Policy:
1. Open `components/legal/cookies-content.tsx`
2. Replace the content inside the component with your actual Cookie Policy
3. Import and use this component in `app/cookies/page.tsx`

## 🎨 Styling Guidelines

When replacing content, use these CSS classes for consistent styling:

### Headings:
```jsx
<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
  Main Title
</h2>

<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
  Section Title
</h3>

<h4 className="text-lg font-medium text-slate-900 dark:text-white">
  Subsection Title
</h4>
```

### Paragraphs:
```jsx
<p className="text-slate-600 dark:text-slate-300">
  Your paragraph text here
</p>
```

### Links:
```jsx
<a 
  href="mailto:your-email@example.com" 
  className="text-blue-600 dark:text-blue-400 hover:underline"
>
  Contact Email
</a>
```

### Lists:
```jsx
<ul className="space-y-2">
  <li className="text-slate-600 dark:text-slate-300">
    List item 1
  </li>
  <li className="text-slate-600 dark:text-slate-300">
    List item 2
  </li>
</ul>
```

## 🔗 Privacy Policy External Link

If you have an external privacy policy URL:

1. Open `app/privacy/page.tsx`
2. Find the button with `YOUR_PRIVACY_POLICY_LINK_HERE`
3. Replace it with your actual URL:
```jsx
<Button
  onClick={() => window.open('https://your-privacy-policy-url.com', '_blank')}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  View Complete Privacy Policy
  <ExternalLink className="ml-2 w-4 h-4" />
</Button>
```

## 📱 Responsive Design

All pages are fully responsive and will look great on:
- Desktop computers
- Tablets
- Mobile phones

The layout automatically adjusts based on screen size.

## 🌙 Dark Mode Support

All pages support both light and dark modes. The styling classes automatically handle:
- Text colors
- Background colors
- Border colors
- Link colors

## 🚀 Testing Your Changes

After updating the content:

1. Start your development server: `npm run dev`
2. Visit each page to ensure content displays correctly:
   - `http://localhost:3000/terms`
   - `http://localhost:3000/privacy`
   - `http://localhost:3000/cookies`
3. Test the registration form:
   - Try registering without checking the terms checkbox (should show error)
   - Test the links to legal pages from the registration form
   - Verify the terms agreement is stored in the database
4. Test on different screen sizes
5. Test dark mode toggle
6. Verify all links work correctly

## 📝 Content Structure Tips

When adding your content:

1. **Use proper heading hierarchy**: h2 → h3 → h4
2. **Keep paragraphs concise**: Break up long text for readability
3. **Use lists for better organization**: When listing items or steps
4. **Include contact information**: Make sure users can reach you
5. **Update the "Last updated" date**: At the top of each page

## 🔒 Legal Compliance

Remember to:
- Have your legal team review the final content
- Ensure compliance with relevant laws (GDPR, CCPA, etc.)
- Keep policies updated as your business evolves
- Make policies easily accessible to users

## 📞 Support

If you need help updating the content or have questions about the implementation, please contact the development team.

---

**Note**: This is a template setup. Always have your legal policies reviewed by qualified legal professionals before publishing them on your website. 