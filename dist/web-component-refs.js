/* web-component-refs v0.0.2 - 2017 - Jeremias Menichelli - MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.webComponentRefs = factory());
}(this, (function () { 'use strict';

  /**
   * Inspects shadow root and creates a refs object in a custom element
   * @method collectRefs
   * @returns {undefined}
   */
  function collectRefs() {
    // check if there's a shadow root in the element
    if (typeof this.shadowRoot === 'undefined') {
      throw new Error('You must create a shadowRoot on the element');
    }

    // create refs base object
    this.refs = {};

    var refsList = this.shadowRoot.querySelectorAll('[ref]');

    // collect refs if any
    if (refsList.length > 0) {
      var refsArray = _toArray(refsList);

      refsArray.map(_assignRef.bind(this));
    }

    // observe added and removed child nodes
    var refsMutationObserver = new MutationObserver(_handleMutations.bind(this));

    refsMutationObserver.observe(this.shadowRoot, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Converts a nodeList to an Array
   * @method _toArray
   * @param {NodeList} nodeList
   * @returns {Array}
   */
  function _toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  /**
   * Checks if node has a ref attribute
   * @method _isRefNode
   * @param {Node} node
   * @returns {Boolean}
   */
  function _isRefNode(node) {
    return (
      node.nodeType
      && node.nodeType === 1
      && (node.hasAttribute('ref') || typeof node.__refString__ === 'string')
    );
  }

  /**
   * Assigns ref to refs object, removes attr and creates __refString__ reference
   * @method _assignNode
   * @param {Node} element
   * @returns {undefined}
   */
  function _assignRef(element) {
    var refString = element.getAttribute('ref');

    // assign element to refs object
    this.refs[ refString ] = element;

    // memoize ref string, clean ref attribute
    element.__refString__ = refString;
    element.removeAttribute('ref');
  }

  /**
   * Checks __refString__ and deletes ref from refs object
   * @method _deleteRef
   * @param {Node} element
   * @returns {undefined}
   */
  function _deleteRef(element) {
    // delete element from refs object
    delete this.refs[ element.__refString__ ];
  }

  /**
   * Callback to detect added and removed nodes from a single mutation
   * @method _handleSingleMutation
   * @param {MutationRecord} mutation
   * @returns {undefined}
   */
  function _handleSingleMutation(mutation) {
    var addedNodes = _toArray(mutation.addedNodes);
    var addedRefs = addedNodes.filter(_isRefNode);

    // assign added nodes
    addedRefs.map(_assignRef.bind(this));

    var removedNodes = _toArray(mutation.removedNodes);
    var removedRefs = removedNodes.filter(_isRefNode);

    // assign removed nodes
    removedRefs.map(_deleteRef.bind(this));
  }

  /**
   * Map mutations and process them
   * @method _handleMutations
   * @param {Array} mutations
   * @returns {undefined}
   */
  function _handleMutations(mutations) {
    mutations.map(_handleSingleMutation.bind(this));
  }

  return collectRefs;

})));
