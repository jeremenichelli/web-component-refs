function collectRefs() {
  // check if there's a shadow root in the element
  if (typeof this.shadowRoot === 'undefined') {
    throw new Error('You must create a shadowRoot on the element');
  }

  // create refs base object
  this.refs = {};

  const refsList = this.shadowRoot.querySelectorAll('[ref]');

  // collect refs if any
  if (refsList.length > 0) {
    const refsArray = _toArray(refsList);
    refsArray.map(_assignRef.bind(this));

    this.__refsMutationObserver__ = new MutationObserver(_handleMutations.bind(this));

    this.__refsMutationObserver__.observe(this.shadowRoot, {
      childList: true,
      subtree: true
    });
  }
};

function _toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function _isRefNode(node) {
  return (
    node.nodeType &&
    node.nodeType === 1 &&
    (node.hasAttribute('ref') || typeof node.__refString__ === 'string')
  );
}

function _assignRef(element) {
  const refString = element.getAttribute('ref');

  // assign element to refs object
  this.refs[ refString ] = element;

  // memoize ref string, clean ref attribute
  element.__refString__ = refString;
  element.removeAttribute('ref');
};

function _deleteRef(element) {
  // delete element from refs object
  delete this.refs[ element.__refString__ ];
};

function _handleSingleMutation(mutation) {
  const addedNodes = _toArray(mutation.addedNodes);
  const addedRefs = addedNodes.filter(_isRefNode);

  // assign added nodes
  addedRefs.map(_assignRef.bind(this));

  const removedNodes = _toArray(mutation.removedNodes);
  const removedRefs = removedNodes.filter(_isRefNode);

  // assign removed nodes
  removedRefs.map(_deleteRef.bind(this));
}

function _handleMutations(mutations) {
  mutations.map(_handleSingleMutation.bind(this));
};

module.exports = collectRefs;
