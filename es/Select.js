'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _KeyCode = require('rc-util/es/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger.js');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _TreeNode2 = require('./TreeNode.js');

var _TreeNode3 = _interopRequireDefault(_TreeNode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function filterFn(input, child) {
  return String((0, _util.getPropValue)(child, (0, _util.labelCompatible)(this.props.treeNodeFilterProp))).indexOf(input) > -1;
}

function saveRef(name, component) {
  this[name] = component;
}

function loopTreeData(data) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return data.map(function (item, index) {
    var pos = level + '-' + index;
    var props = {
      title: item.label,
      value: item.value,
            key: item.key || item.value || pos,
      disabled: item.disabled || false,
      selectable: item.hasOwnProperty('selectable') ? item.selectable : true
    };
    var ret = void 0;
    if (item.children && item.children.length) {
      ret = _react2['default'].createElement(
        _TreeNode3['default'],
        props,
        loopTreeData(item.children, pos)
      );
    } else {
      ret = _react2['default'].createElement(_TreeNode3['default'], (0, _extends3['default'])({}, props, { isLeaf: item.isLeaf }));
    }
    return ret;
  });
}

var SHOW_ALL = 'SHOW_ALL';
var SHOW_PARENT = 'SHOW_PARENT';
var SHOW_CHILD = 'SHOW_CHILD';

var Select = function (_Component) {
  (0, _inherits3['default'])(Select, _Component);

  function Select(props) {
    (0, _classCallCheck3['default'])(this, Select);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    var value = [];
    if ('value' in props) {
      value = (0, _util.toArray)(props.value);
    } else {
      value = (0, _util.toArray)(props.defaultValue);
    }
        _this.renderedTreeData = _this.renderTreeData();
    value = _this.addLabelToValue(props, value);
    value = _this.getValue(props, value, props.inputValue ? '__strict' : true);
    var inputValue = props.inputValue || '';
                _this.saveInputRef = saveRef.bind(_this, 'inputInstance');
    _this.state = {
      value: value,
      inputValue: inputValue,
      open: props.open || props.defaultOpen,
      focused: false
    };
    return _this;
  }

  (0, _createClass3['default'])(Select, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.inputValue) {
        var inputNode = this.getInputDOMNode();
        if (inputNode && inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = inputNode.scrollWidth + 'px';
        }
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
            this.renderedTreeData = this.renderTreeData(nextProps);
                  this._cacheTreeNodesStates = this._cacheTreeNodesStates !== 'no' && this._savedValue && nextProps.value === this._savedValue;
      if (this.props.treeData !== nextProps.treeData || this.props.children !== nextProps.children) {
                this._treeNodesStates = (0, _util.getTreeNodesStates)(this.renderedTreeData || nextProps.children, this.state.value.map(function (item) {
          return item.value;
        }));
      }
      if ('value' in nextProps) {
        var value = (0, _util.toArray)(nextProps.value);
        value = this.addLabelToValue(nextProps, value);
        value = this.getValue(nextProps, value);
        this.setState({
          value: value
        });
                                              }
      if (nextProps.inputValue !== this.props.inputValue) {
        this.setState({
          inputValue: nextProps.inputValue
        });
      }
      if ('open' in nextProps) {
        this.setState({
          open: nextProps.open
        });
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (this._savedValue && nextProps.value && nextProps.value !== this._savedValue && nextProps.value === this.props.value) {
        this._cacheTreeNodesStates = false;
        this.getValue(nextProps, this.addLabelToValue(nextProps, (0, _util.toArray)(nextProps.value)));
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var state = this.state;
      var props = this.props;
      if (state.open && (0, _util.isMultipleOrTags)(props)) {
        var inputNode = this.getInputDOMNode();
        if (inputNode.value) {
          inputNode.style.width = '';
          inputNode.style.width = inputNode.scrollWidth + 'px';
        } else {
          inputNode.style.width = '';
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearDelayTimer();
      if (this.dropdownContainer) {
        _reactDom2['default'].unmountComponentAtNode(this.dropdownContainer);
        document.body.removeChild(this.dropdownContainer);
        this.dropdownContainer = null;
      }
    }

    
  }, {
    key: 'getLabelFromNode',
    value: function getLabelFromNode(child) {
      return (0, _util.getPropValue)(child, this.props.treeNodeLabelProp);
    }
  }, {
    key: 'getLabelFromProps',
    value: function getLabelFromProps(props, value) {
      var _this2 = this;

      if (value === undefined) {
        return null;
      }
      var label = null;
      (0, _util.loopAllChildren)(this.renderedTreeData || props.children, function (item) {
        if ((0, _util.getValuePropValue)(item) === value) {
          label = _this2.getLabelFromNode(item);
        }
      });
      if (label === null) {
        return value;
      }
      return label;
    }
  }, {
    key: 'getDropdownContainer',
    value: function getDropdownContainer() {
      if (!this.dropdownContainer) {
        this.dropdownContainer = document.createElement('div');
        document.body.appendChild(this.dropdownContainer);
      }
      return this.dropdownContainer;
    }
  }, {
    key: 'getSearchPlaceholderElement',
    value: function getSearchPlaceholderElement(hidden) {
      var props = this.props;
      var placeholder = props.placeholder || props.searchPlaceholder;
      if (placeholder) {
        return _react2['default'].createElement(
          'span',
          {
            style: { display: hidden ? 'none' : 'block' },
            onClick: this.onPlaceholderClick,
            className: props.prefixCls + '-search__field__placeholder'
          },
          placeholder
        );
      }
      return null;
    }
  }, {
    key: 'getInputElement',
    value: function getInputElement() {
      var props = this.props;
      return _react2['default'].createElement(
        'span',
        { className: props.prefixCls + '-search__field__wrap' },
        _react2['default'].createElement('input', {
          ref: this.saveInputRef,
          onChange: this.onInputChange,
          onKeyDown: this.onInputKeyDown,
          value: this.state.inputValue,
          disabled: props.disabled,
          className: props.prefixCls + '-search__field',
          role: 'textbox'
        }),
        (0, _util.isMultipleOrTags)(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)
      );
    }
  }, {
    key: 'getInputDOMNode',
    value: function getInputDOMNode() {
      return this.inputInstance;
    }
  }, {
    key: 'getPopupDOMNode',
    value: function getPopupDOMNode() {
      return this.refs.trigger.getPopupDOMNode();
    }
  }, {
    key: 'getPopupComponentRefs',
    value: function getPopupComponentRefs() {
      return this.refs.trigger.getPopupEleRefs();
    }
  }, {
    key: 'getValue',
    value: function getValue(_props, val) {
      var _this3 = this;

      var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var value = val;
            var _strict = init === '__strict' || init && (this.state && this.state.inputValue || this.props.inputValue !== _props.inputValue);
      if (_props.treeCheckable && (_props.treeCheckStrictly || _strict)) {
        this.halfCheckedValues = [];
        value = [];
        val.forEach(function (i) {
          if (!i.halfChecked) {
            value.push(i);
          } else {
            _this3.halfCheckedValues.push(i);
          }
        });
      }
            if (!!!_props.treeCheckable || _props.treeCheckable && (_props.treeCheckStrictly || _strict)) {
        return value;
      }
      var checkedTreeNodes = void 0;
      if (this._cachetreeData && this._cacheTreeNodesStates && this._checkedNodes && this.state && !this.state.inputValue) {
        this.checkedTreeNodes = checkedTreeNodes = this._checkedNodes;
      } else {
        /**
         * Note: `this._treeNodesStates`'s treeNodesStates must correspond to nodes of the
         * final tree (`processTreeNode` function from SelectTrigger.jsx produce the final tree).
         *
         * And, `this._treeNodesStates` from `onSelect` is previous value,
         * so it perhaps only have a few nodes, but the newly filtered tree can have many nodes,
         * thus, you cannot use previous _treeNodesStates.
         */
                this._treeNodesStates = (0, _util.getTreeNodesStates)(this.renderedTreeData || _props.children, value.map(function (item) {
          return item.value;
        }));
        this.checkedTreeNodes = checkedTreeNodes = this._treeNodesStates.checkedNodes;
      }
      var mapLabVal = function mapLabVal(arr) {
        return arr.map(function (itemObj) {
          return {
            value: (0, _util.getValuePropValue)(itemObj.node),
            label: (0, _util.getPropValue)(itemObj.node, _props.treeNodeLabelProp)
          };
        });
      };
      var props = this.props;
      var checkedValues = [];
      if (props.showCheckedStrategy === SHOW_ALL) {
        checkedValues = mapLabVal(checkedTreeNodes);
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        var posArr = (0, _util.filterParentPosition)(checkedTreeNodes.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }));
      } else {
        checkedValues = mapLabVal(checkedTreeNodes.filter(function (itemObj) {
          return !itemObj.node.props.children;
        }));
      }
      return checkedValues;
    }
  }, {
    key: 'getCheckedNodes',
    value: function getCheckedNodes(info, props) {
            var checkedNodes = info.checkedNodes;
      
      if (props.treeCheckStrictly || this.state.inputValue) {
        return checkedNodes;
      }
      var checkedNodesPositions = info.checkedNodesPositions;
      if (props.showCheckedStrategy === SHOW_ALL) {
        checkedNodes = checkedNodes;
      } else if (props.showCheckedStrategy === SHOW_PARENT) {
        var posArr = (0, _util.filterParentPosition)(checkedNodesPositions.map(function (itemObj) {
          return itemObj.pos;
        }));
        checkedNodes = checkedNodesPositions.filter(function (itemObj) {
          return posArr.indexOf(itemObj.pos) !== -1;
        }).map(function (itemObj) {
          return itemObj.node;
        });
      } else {
        checkedNodes = checkedNodes.filter(function (n) {
          return !n.props.children;
        });
      }
      return checkedNodes;
    }
  }, {
    key: 'getDeselectedValue',
    value: function getDeselectedValue(selectedValue) {
      var checkedTreeNodes = this.checkedTreeNodes;
      var unCheckPos = void 0;
      checkedTreeNodes.forEach(function (itemObj) {
        if (itemObj.node.props.value === selectedValue) {
          unCheckPos = itemObj.pos;
        }
      });
      var nArr = unCheckPos.split('-');
      var newVals = [];
      var newCkTns = [];
      checkedTreeNodes.forEach(function (itemObj) {
        var iArr = itemObj.pos.split('-');
        if (itemObj.pos === unCheckPos || nArr.length > iArr.length && (0, _util.isInclude)(iArr, nArr) || nArr.length < iArr.length && (0, _util.isInclude)(nArr, iArr)) {
                    return;
        }
        newCkTns.push(itemObj);
        newVals.push(itemObj.node.props.value);
      });
      this.checkedTreeNodes = this._checkedNodes = newCkTns;
      var nv = this.state.value.filter(function (val) {
        return newVals.indexOf(val.value) !== -1;
      });
      this.fireChange(nv, { triggerValue: selectedValue, clear: true });
    }
  }, {
    key: 'setOpenState',
    value: function setOpenState(open, needFocus) {
      var _this4 = this;

      var documentClickClose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.clearDelayTimer();
      var props = this.props,
          refs = this.refs;
                        
      if (!this.props.onDropdownVisibleChange(open, { documentClickClose: documentClickClose })) {
        return;
      }
      this.setState({
        open: open
      }, function () {
        if (needFocus || open) {
          if (open || (0, _util.isMultipleOrTagsOrCombobox)(props)) {
            var input = _this4.getInputDOMNode();
            if (input && document.activeElement !== input) {
              input.focus();
            }
          } else if (refs.selection) {
            refs.selection.focus();
          }
        }
      });
    }
  }, {
    key: 'addLabelToValue',
    value: function addLabelToValue(props, value_) {
      var _this5 = this;

      var value = value_;
      if (this.isLabelInValue()) {
        value.forEach(function (v, i) {
          if (Object.prototype.toString.call(value[i]) !== '[object Object]') {
            value[i] = {
              value: '',
              label: ''
            };
            return;
          }
          v.label = v.label || _this5.getLabelFromProps(props, v.value);
        });
      } else {
        value = value.map(function (v) {
          return {
            value: v,
            label: _this5.getLabelFromProps(props, v)
          };
        });
      }
      return value;
    }
  }, {
    key: 'clearDelayTimer',
    value: function clearDelayTimer() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    }
  }, {
    key: 'removeSelected',
    value: function removeSelected(selectedVal) {
      var props = this.props;
      if (props.disabled) {
        return;
      }
      this._cacheTreeNodesStates = 'no';
      if (props.treeCheckable && (props.showCheckedStrategy === SHOW_ALL || props.showCheckedStrategy === SHOW_PARENT) && !(props.treeCheckStrictly || this.state.inputValue)) {
        this.getDeselectedValue(selectedVal);
        return;
      }
                        var label = void 0;
      var value = this.state.value.filter(function (singleValue) {
        if (singleValue.value === selectedVal) {
          label = singleValue.label;
        }
        return singleValue.value !== selectedVal;
      });
      var canMultiple = (0, _util.isMultipleOrTags)(props);

      if (canMultiple) {
        var event = selectedVal;
        if (this.isLabelInValue()) {
          event = {
            value: selectedVal,
            label: label
          };
        }
        props.onDeselect(event);
      }
      if (props.treeCheckable) {
        if (this.checkedTreeNodes && this.checkedTreeNodes.length) {
          this.checkedTreeNodes = this._checkedNodes = this.checkedTreeNodes.filter(function (item) {
            return value.some(function (i) {
              return i.value === item.node.props.value;
            });
          });
        }
      }
      this.fireChange(value, { triggerValue: selectedVal, clear: true });
    }
  }, {
    key: 'openIfHasChildren',
    value: function openIfHasChildren() {
      var props = this.props;
      if (_react2['default'].Children.count(props.children) || (0, _util.isSingleMode)(props)) {
        this.setOpenState(true);
      }
    }
  }, {
    key: 'fireChange',
    value: function fireChange(value, extraInfo) {
      var props = this.props;
      var vals = value.map(function (i) {
        return i.value;
      });
      var sv = this.state.value.map(function (i) {
        return i.value;
      });
      if (vals.length !== sv.length || !vals.every(function (val, index) {
        return sv[index] === val;
      })) {
        var ex = { preValue: [].concat((0, _toConsumableArray3['default'])(this.state.value)) };
        if (extraInfo) {
          (0, _objectAssign2['default'])(ex, extraInfo);
        }
        var labs = null;
        var vls = value;
        if (!this.isLabelInValue()) {
          labs = value.map(function (i) {
            return i.label;
          });
          vls = vls.map(function (v) {
            return v.value;
          });
        } else if (this.halfCheckedValues && this.halfCheckedValues.length) {
          this.halfCheckedValues.forEach(function (i) {
            if (!vls.some(function (v) {
              return v.value === i.value;
            })) {
              vls.push(i);
            }
          });
        }
        if (props.treeCheckable && ex.clear) {
          var treeData = this.renderedTreeData || props.children;
          ex.allCheckedNodes = (0, _util.flatToHierarchy)((0, _util.filterAllCheckedData)(vals, treeData));
        }
        if (props.treeCheckable && this.state.inputValue) {
          var _vls = [].concat((0, _toConsumableArray3['default'])(this.state.value));
          if (ex.checked) {
            value.forEach(function (i) {
              if (_vls.every(function (ii) {
                return ii.value !== i.value;
              })) {
                _vls.push((0, _extends3['default'])({}, i));
              }
            });
          } else {
            var index = void 0;
            var includeVal = _vls.some(function (i, ind) {
              if (i.value === ex.triggerValue) {
                index = ind;
                return true;
              }
            });
            if (includeVal) {
              _vls.splice(index, 1);
            }
          }
          vls = _vls;
          if (!this.isLabelInValue()) {
            labs = _vls.map(function (v) {
              return v.label;
            });
            vls = _vls.map(function (v) {
              return v.value;
            });
          }
        }
        this._savedValue = (0, _util.isMultipleOrTags)(props) ? vls : vls[0];
        props.onChange(this._savedValue, labs, ex);
        if (!('value' in props)) {
          this._cacheTreeNodesStates = false;
          this.setState({
            value: this.getValue(props, (0, _util.toArray)(this._savedValue).map(function (v, i) {
              return {
                value: v,
                label: labs[i]
              };
            }))
          });
        }
      }
    }
  }, {
    key: 'isLabelInValue',
    value: function isLabelInValue() {
      var _props2 = this.props,
          treeCheckable = _props2.treeCheckable,
          treeCheckStrictly = _props2.treeCheckStrictly,
          labelInValue = _props2.labelInValue;

      if (treeCheckable && treeCheckStrictly) {
        return true;
      }
      return labelInValue || false;
    }
  }, {
    key: 'renderTopControlNode',
    value: function renderTopControlNode() {
      var _this6 = this;

      var value = this.state.value;

      var props = this.props;
      var choiceTransitionName = props.choiceTransitionName,
          prefixCls = props.prefixCls,
          maxTagTextLength = props.maxTagTextLength;
      
      if ((0, _util.isSingleMode)(props)) {
        var innerNode = _react2['default'].createElement(
          'span',
          {
            key: 'placeholder',
            className: prefixCls + '-selection__placeholder'
          },
          props.placeholder
        );
        if (value.length) {
          innerNode = _react2['default'].createElement(
            'span',
            {
              key: 'value',
              title: value[0].label,
              className: prefixCls + '-selection-selected-value'
            },
            value[0].label
          );
        }
        return _react2['default'].createElement(
          'span',
          { className: prefixCls + '-selection__rendered' },
          innerNode
        );
      }

      var selectedValueNodes = [];
      if ((0, _util.isMultipleOrTags)(props)) {
        selectedValueNodes = value.map(function (singleValue) {
          var content = singleValue.label;
          var title = content;
          if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
            content = content.slice(0, maxTagTextLength) + '...';
          }
          return _react2['default'].createElement(
            'li',
            (0, _extends3['default'])({
              style: _util.UNSELECTABLE_STYLE
            }, _util.UNSELECTABLE_ATTRIBUTE, {
              onMouseDown: _util.preventDefaultEvent,
              className: prefixCls + '-selection__choice',
              key: singleValue.value,
              title: title
            }),
            _react2['default'].createElement('span', {
              className: prefixCls + '-selection__choice__remove',
              onClick: _this6.removeSelected.bind(_this6, singleValue.value)
            }),
            _react2['default'].createElement(
              'span',
              { className: prefixCls + '-selection__choice__content' },
              content
            )
          );
        });
      }
      selectedValueNodes.push(_react2['default'].createElement(
        'li',
        {
          className: prefixCls + '-search ' + prefixCls + '-search--inline',
          key: '__input'
        },
        this.getInputElement()
      ));
      var className = prefixCls + '-selection__rendered';
      if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
        return _react2['default'].createElement(
          _rcAnimate2['default'],
          {
            className: className,
            component: 'ul',
            transitionName: choiceTransitionName
          },
          selectedValueNodes
        );
      }
      return _react2['default'].createElement(
        'ul',
        { className: className },
        selectedValueNodes
      );
    }
  }, {
    key: 'renderTreeData',
    value: function renderTreeData(props) {
      var validProps = props || this.props;
      if (validProps.treeData) {
        if (props && props.treeData === this.props.treeData && this.renderedTreeData) {
                    this._cachetreeData = true;
          return this.renderedTreeData;
        }
        this._cachetreeData = false;
        var treeData = [].concat((0, _toConsumableArray3['default'])(validProps.treeData));
                if (validProps.treeDataSimpleMode) {
          var simpleFormat = {
            id: 'id',
            pId: 'pId',
            rootPId: null
          };
          if (Object.prototype.toString.call(validProps.treeDataSimpleMode) === '[object Object]') {
            (0, _objectAssign2['default'])(simpleFormat, validProps.treeDataSimpleMode);
          }
          treeData = (0, _util.processSimpleTreeData)(treeData, simpleFormat);
        }
        return loopTreeData(treeData);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _rootCls;

      var props = this.props;
      var multiple = (0, _util.isMultipleOrTags)(props);
      var state = this.state;
      var className = props.className,
          disabled = props.disabled,
          allowClear = props.allowClear,
          prefixCls = props.prefixCls;

      var ctrlNode = this.renderTopControlNode();
      var extraSelectionProps = {};
      if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
        extraSelectionProps = {
          onKeyDown: this.onKeyDown,
          tabIndex: 0
        };
      }
      var rootCls = (_rootCls = {}, (0, _defineProperty3['default'])(_rootCls, className, !!className), (0, _defineProperty3['default'])(_rootCls, prefixCls, 1), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-open', state.open), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-focused', state.open || state.focused), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_rootCls, prefixCls + '-enabled', !disabled), _rootCls);

      var clear = _react2['default'].createElement('span', {
        key: 'clear',
        className: prefixCls + '-selection__clear',
        onClick: this.onClearSelection
      });
      return _react2['default'].createElement(
        _SelectTrigger2['default'],
        (0, _extends3['default'])({}, props, {
          treeNodes: props.children,
          treeData: this.renderedTreeData,
          _cachetreeData: this._cachetreeData,
          _treeNodesStates: this._treeNodesStates,
          halfCheckedValues: this.halfCheckedValues,
          multiple: multiple,
          disabled: disabled,
          visible: state.open,
          inputValue: state.inputValue,
          inputElement: this.getInputElement(),
          value: state.value,
          onDropdownVisibleChange: this.onDropdownVisibleChange,
          getPopupContainer: props.getPopupContainer,
          onSelect: this.onSelect,
          ref: 'trigger'
        }),
        _react2['default'].createElement(
          'span',
          {
            style: props.style,
            onClick: props.onClick,
            className: (0, _classnames2['default'])(rootCls)
          },
          _react2['default'].createElement(
            'span',
            (0, _extends3['default'])({
              ref: 'selection',
              key: 'selection',
              className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
              role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-haspopup': 'true',
              'aria-expanded': state.open
            }, extraSelectionProps),
            ctrlNode,
            allowClear && !multiple && this.state.value.length && this.state.value[0].value ? clear : null,
            props.showArrow && _react2['default'].createElement(
              'span',
              {
                key: 'arrow',
                className: prefixCls + '-arrow',
                style: { outline: 'none' }
              },
              _react2['default'].createElement('b', null)
            ),
            multiple ? this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) : null
          )
        )
      );
    }
  }]);
  return Select;
}(_react.Component);

Select.propTypes = {
  children: _propTypes2['default'].any,
  className: _propTypes2['default'].string,
  prefixCls: _propTypes2['default'].string,
  multiple: _propTypes2['default'].bool,
  filterTreeNode: _propTypes2['default'].any,
  showSearch: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  showArrow: _propTypes2['default'].bool,
  allowClear: _propTypes2['default'].bool,
    defaultOpen: _propTypes2['default'].bool,
  open: _propTypes2['default'].bool,
  transitionName: _propTypes2['default'].string,
  animation: _propTypes2['default'].string,
  choiceTransitionName: _propTypes2['default'].string,
  onClick: _propTypes2['default'].func,
  onChange: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  onDeselect: _propTypes2['default'].func,
  onSearch: _propTypes2['default'].func,
  searchPlaceholder: _propTypes2['default'].string,
  placeholder: _propTypes2['default'].any,
  inputValue: _propTypes2['default'].any,
  value: _propTypes2['default'].oneOfType([_propTypes2['default'].array, _propTypes2['default'].string, _propTypes2['default'].object]),
  defaultValue: _propTypes2['default'].oneOfType([_propTypes2['default'].array, _propTypes2['default'].string, _propTypes2['default'].object]),
  label: _propTypes2['default'].any,
  defaultLabel: _propTypes2['default'].any,
  labelInValue: _propTypes2['default'].bool,
  dropdownStyle: _propTypes2['default'].object,
  drodownPopupAlign: _propTypes2['default'].object,
  onDropdownVisibleChange: _propTypes2['default'].func,
  maxTagTextLength: _propTypes2['default'].number,
  showCheckedStrategy: _propTypes2['default'].oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),
    treeCheckStrictly: _propTypes2['default'].bool,
  treeIcon: _propTypes2['default'].bool,
  treeLine: _propTypes2['default'].bool,
  treeDefaultExpandAll: _propTypes2['default'].bool,
  treeCheckable: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].node]),
  treeNodeLabelProp: _propTypes2['default'].string,
  treeNodeFilterProp: _propTypes2['default'].string,
  treeData: _propTypes2['default'].array,
  treeDataSimpleMode: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].object]),
  loadData: _propTypes2['default'].func
};
Select.defaultProps = {
  prefixCls: 'rc-tree-select',
  filterTreeNode: filterFn,
  showSearch: true,
  allowClear: false,
  placeholder: '',
  searchPlaceholder: '',
  labelInValue: false,
  defaultValue: [],
  inputValue: '',
  onClick: noop,
  onChange: noop,
  onSelect: noop,
  onDeselect: noop,
  onSearch: noop,
  showArrow: true,
  dropdownMatchSelectWidth: true,
  dropdownStyle: {},
  onDropdownVisibleChange: function onDropdownVisibleChange() {
    return true;
  },
  notFoundContent: 'Not Found',
  showCheckedStrategy: SHOW_CHILD,
    treeCheckStrictly: false,
  treeIcon: false,
  treeLine: false,
  treeDataSimpleMode: false,
  treeDefaultExpandAll: false,
  treeCheckable: false,
  treeNodeFilterProp: 'value',
  treeNodeLabelProp: 'title'
};

var _initialiseProps = function _initialiseProps() {
  var _this7 = this;

  this.onInputChange = function (event) {
    var val = event.target.value;
    var props = _this7.props;

    _this7.setState({
      inputValue: val,
      open: true
    });
    if (props.treeCheckable && !val) {
      _this7.setState({
        value: _this7.getValue(props, [].concat((0, _toConsumableArray3['default'])(_this7.state.value)), false)
      });
    }
                        props.onSearch(val);
  };

  this.onDropdownVisibleChange = function (open) {
        if (!open && document.activeElement === _this7.getInputDOMNode()) {}
    
            setTimeout(function () {
      _this7.setOpenState(open, undefined, !open);
    }, 10);
  };

  this.onKeyDown = function (event) {
    var props = _this7.props;
    if (props.disabled) {
      return;
    }
    var keyCode = event.keyCode;
    if (_this7.state.open && !_this7.getInputDOMNode()) {
      _this7.onInputKeyDown(event);
    } else if (keyCode === _KeyCode2['default'].ENTER || keyCode === _KeyCode2['default'].DOWN) {
      _this7.setOpenState(true);
      event.preventDefault();
    }
  };

  this.onInputKeyDown = function (event) {
    var props = _this7.props;
    if (props.disabled) {
      return;
    }
    var state = _this7.state;
    var keyCode = event.keyCode;
    if ((0, _util.isMultipleOrTags)(props) && !event.target.value && keyCode === _KeyCode2['default'].BACKSPACE) {
      var value = state.value.concat();
      if (value.length) {
        var popValue = value.pop();
        props.onDeselect(_this7.isLabelInValue() ? popValue : popValue.key);
        _this7.fireChange(value);
      }
      return;
    }
    if (keyCode === _KeyCode2['default'].DOWN) {
      if (!state.open) {
        _this7.openIfHasChildren();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    } else if (keyCode === _KeyCode2['default'].ESC) {
      if (state.open) {
        _this7.setOpenState(false);
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
  };

  this.onSelect = function (selectedKeys, info) {
    if (info.selected === false) {
      _this7.onDeselect(info);
      return;
    }
    var item = info.node;
    var value = _this7.state.value;
    var props = _this7.props;
    var selectedValue = (0, _util.getValuePropValue)(item);
    var selectedLabel = _this7.getLabelFromNode(item);
    var event = selectedValue;
    if (_this7.isLabelInValue()) {
      event = {
        value: event,
        label: selectedLabel
      };
    }
    props.onSelect(event, item, info);
    var checkEvt = info.event === 'check';
    if ((0, _util.isMultipleOrTags)(props)) {
      if (checkEvt) {
        value = _this7.getCheckedNodes(info, props).map(function (n) {
          return {
            value: (0, _util.getValuePropValue)(n),
            label: _this7.getLabelFromNode(n)
          };
        });
      } else {
        if (value.some(function (i) {
          return i.value === selectedValue;
        })) {
          return;
        }
        value = value.concat([{
          value: selectedValue,
          label: selectedLabel
        }]);
      }
    } else {
      if (value.length && value[0].value === selectedValue) {
        _this7.setOpenState(false);
        return;
      }
      value = [{
        value: selectedValue,
        label: selectedLabel
      }];
      _this7.setOpenState(false);
    }

    var extraInfo = {
      triggerValue: selectedValue,
      triggerNode: item
    };
    if (checkEvt) {
      extraInfo.checked = info.checked;
            extraInfo.allCheckedNodes = props.treeCheckStrictly || _this7.state.inputValue ? info.checkedNodes : (0, _util.flatToHierarchy)(info.checkedNodesPositions);
      _this7._checkedNodes = info.checkedNodesPositions;
      var _tree = _this7.refs.trigger.popupEle;
      _this7._treeNodesStates = _tree.checkKeys;
    } else {
      extraInfo.selected = info.selected;
    }

    _this7.fireChange(value, extraInfo);
    if (props.inputValue === null) {
      _this7.setState({
        inputValue: ''
      });
    }
  };

  this.onDeselect = function (info) {
    _this7.removeSelected((0, _util.getValuePropValue)(info.node));
    if (!(0, _util.isMultipleOrTags)(_this7.props)) {
      _this7.setOpenState(false);
    }
    if (_this7.props.inputValue === null) {
      _this7.setState({
        inputValue: ''
      });
    }
  };

  this.onPlaceholderClick = function () {
    _this7.getInputDOMNode().focus();
  };

  this.onClearSelection = function (event) {
    var props = _this7.props;
    var state = _this7.state;
    if (props.disabled) {
      return;
    }
    event.stopPropagation();
    if (state.inputValue || state.value.length) {
      _this7.fireChange([]);
      _this7.setOpenState(false);
      if (props.inputValue === null) {
        _this7.setState({
          inputValue: ''
        });
      }
    }
  };
};

Select.SHOW_ALL = SHOW_ALL;
Select.SHOW_PARENT = SHOW_PARENT;
Select.SHOW_CHILD = SHOW_CHILD;

exports['default'] = Select;