(function(window, $) {
	/**
	 * 转义选择器
	 * @param  {String} selector 要转义的选择器
	 * @return {String}          转头后的选择器
	 */
	function escapeSelector(selector) {
		return selector.replace(/([\!\"\#\$\%\&'\(\)\*\+\,\.\/\:\;<\=>\?\@\[\\\]\^\`\{\|\}\~])/g, "\\$1");
	}
	/**
	 * id在编辑页面是否唯一
	 * @param  {Document} doc [元素的对应document]
	 * @param  {String}   id  [元素id]
	 * @return {Boolean}
	 */
	function idUnique(doc, id) {
		return $(doc).find('[id="' + id + '"]').length === 1;
	}
	/**
	 * class选择器对应在编辑页面中可选择节点的数量
	 * @param  {Document} doc     [元素的对应document]
	 * @param  {String}  selector [class选择器]
	 * @return {Number}
	 */
	function classSelectorEleCount(doc, selector) {
		return $(doc).find(selector).length;
	}
	/**
	 * 获取元素的tagName
	 * @param  {Element} el [元素节点]
	 * @return {String}     [tagName小写]
	 */
	function getEleTagName(el) {
		var tagName;
		return el && el.tagName && el.tagName.toLowerCase() || 'document';
	}
	/**
	 * 获取元素的class选择器信息
	 * @param  {Element} el [元素节点]
	 * @return {Object}     [属性selector为最优class选择器(选择元素最少)， unique表示该class选择器的唯一性]
	 */
	function getClassSelector(el) {
		var klazz,
			classes,
			selector,
			selectorCount,
			least = 0,
			returnValue = {};
			className = el.className,
			tagName = getEleTagName(el),

		returnValue.selector = '';
		if (className && tagName) {
			tagName = tagName.toLowerCase();
			classes = className.split(/\s+/);
			while(classes.length) {
				klazz = classes.shift();
				selector = "" + tagName + "." + (escapeSelector(klazz));
				selectorCount = classSelectorEleCount(el.ownerDocument, selector);
				if (least === 0 || selectorCount < least) {
					least = selectorCount;
					returnValue.selector = selector;
					if (selectorCount === 1) {
						break;
					}
				}
			}
		}

		returnValue.unique = least === 1;
		return returnValue;
	}
	/**
	 * 递归获取元素选择器
	 * @param  {Node or jQuery} el       [节点元素]
	 * @param  {Array}          selector [选择器数组]
	 * @return {Array}                   [选择器数组]
	 */
	function getSelectorRecursive(el, selector) {
		var id,
			classSelectorInfo,
			tagName = getEleTagName(el);

		if (!el) {
			return selector;
		}
		if (tagName === 'body') {
			selector.unshift('body');
			return selector;
		}
		id = el.id;
		if (id && idUnique(el.ownerDocument, id)) {
			selector.unshift('#' + escapeSelector(id));
			return selector;
		}

		classSelectorInfo = getClassSelector(el);
		selector.unshift(classSelectorInfo.selector);
		if (selector.unique) {
			return selector;
		}

		if (!classSelectorInfo.selector) {
			selector.unshift(':eq(' + $(el).index() + ')');
		}
		return getSelectorRecursive(el.parentNode, selector);
	}
	/**
	 * 获取节点的唯一jquery选择器
	 * @param  {Node or jQuery} el  [传入的节点]
	 * @return {String}             [返回选择器]
	 */
	function getSelector(el) {
		selector = getSelectorRecursive($(el)[0], []);
		return selector.join(' > ');
	}

	window["uniqueSelector"] = getSelector;
})(window, jQuery);