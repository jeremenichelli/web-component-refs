# web-component-refs

Refs, like you know them in React and Vue, for web components.

_Though this package has already been used and worked fine I will considered this in **beta** until tests are written for it._


## Install

If you are using a bundler, install as a package:

```sh
npm install web-component-refs --save
```

Or you can include the script in your project, the package will live in the `webComponentRefs` namespace.


## Why

When building web components I encounter with the issue of doing a lot of DOM scraping to apply some operations like changing text content in the shadow root of the component. I missed **refs**, like I used them in Vue or React.

So, I created a package that generates a `refs` object in the custom element, this collects all elements with a _ref_ attribute and keep the _refs_ updated when nodes are deleted or added to the element's shadow root.


## Use

Given a custom element, add _ref_ attributes to your shadow DOM and on the connected callback call the module method with the element instance as the callee.

```js
import collectRefs from 'web-component-refs';

class SearchBox extends HTMLElement {
  constructor() {
    super();

    // generate shadow root
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <form action="?" ref="form">
        <input type="text" ref="input"/>
        <button type="submit" ref="button">Search</button>
      </form>
    `;
  }

  connectedCallback() {
    // COLLECT REFS!
    collectRefs.call(this);
  }
}
```

After the module is initialized inside the instance, you will be able to access to the elements by doing `this.refs.input` to get the value or add event listeners.

If you modify the shadow DOM of the element and remove some of its elements, a `MutationObserver` will detect these changes and remove or add these references from the `refs` object.

You can read more about this approach here: http://jeremenichelli.io/2017/10/the-web-components-experience/#dom-manipulation-and-refs


## LICENSE

```
MIT License

Copyright (c) 2017 Jeremias Menichelli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
